import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CreditCard, MapPin, ShoppingBag, CheckCircle, Trash, CircleNotch, Star } from '@phosphor-icons/react'
import { useCurrency } from '@/lib/currency'
import { CartItem } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const SQUARE_APP_ID = 'sq0idp-43qL6aQBAzjH4YxO22sxlg'
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || ''

interface CheckoutPageProps {
  cartItems: CartItem[]
  onRemoveItem: (productId: string) => void
}

export function CheckoutPage({ cartItems = [], onRemoveItem }: CheckoutPageProps) {
  const { format } = useCurrency()
  const [card, setCard] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const cardContainerRef = useRef<HTMLDivElement>(null)

  // User & points state
  const [userId, setUserId] = useState<string | null>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [redeemInput, setRedeemInput] = useState('')
  const [pointsEarned, setPointsEarned] = useState(0)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? (subtotal >= 50 ? 0 : 8) : 0
  const tax = subtotal * 0.13
  const pointsDiscount = pointsToRedeem / 50 // 50 points = $1
  const total = Math.max(0, subtotal + shipping + tax - pointsDiscount)
  const earnedPoints = Math.floor(subtotal) // 1 point per $1 spent

  useEffect(() => {
    // Load user session and points
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        loadUserPoints(session.user.id)
        // Pre-fill form with profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setForm(f => ({
                ...f,
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                email: data.email || ''
              }))
            }
          })
      }
    })

    // Load Square SDK
    const script = document.createElement('script')
    script.src = 'https://web.squarecdn.com/v1/square.js'
    script.onload = async () => {
      try {
        const payments = (window as any).Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID)
        const cardInstance = await payments.card()
        await cardInstance.attach('#card-container')
        setCard(cardInstance)
      } catch (err) {
        console.error('Square SDK error:', err)
      }
    }
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const loadUserPoints = async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', uid)
      .single()
    if (data) setUserPoints(data.points || 0)
  }

  const handleRedeemPoints = () => {
    const points = parseInt(redeemInput)
    if (isNaN(points) || points < 0) {
      toast.error('Please enter a valid number of points')
      return
    }
    if (points > userPoints) {
      toast.error(`You only have ${userPoints} points available`)
      return
    }
    if (points % 50 !== 0) {
      toast.error('Points must be redeemed in multiples of 50')
      return
    }
    setPointsToRedeem(points)
    toast.success(`${points} points applied — $${(points / 50).toFixed(2)} off!`)
  }

  const handlePayment = async () => {
    if (!card) return
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.postalCode) {
      setErrorMessage('Please fill in all shipping fields')
      return
    }

    setLoading(true)
    setErrorMessage('')

    try {
      const result = await card.tokenize()
      if (result.status === 'OK') {
        const response = await fetch('/api/square/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: total,
            currency: 'CAD',
            orderDetails: {
              items: cartItems,
              shipping: form
            }
          })
        })

        const data = await response.json()
        if (data.success) {
          // Award points and deduct redeemed points
          if (userId) {
            const newPoints = userPoints - pointsToRedeem + earnedPoints
            await supabase
              .from('profiles')
              .update({ points: newPoints })
              .eq('id', userId)

            // Save order to database
            await supabase
              .from('orders')
              .insert({
                user_id: userId,
                order_total: total,
                status: 'pending',
                items: cartItems,
                shipping_address: form,
                points_earned: earnedPoints,
                points_used: pointsToRedeem
              })

            setPointsEarned(earnedPoints)
          }

          setPaymentStatus('success')
        } else {
          setErrorMessage(data.details || 'Payment failed. Please try again.')
          setPaymentStatus('error')
        }
      } else {
        setErrorMessage(result.errors?.[0]?.message || 'Card tokenization failed')
        setPaymentStatus('error')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong')
      setPaymentStatus('error')
    } finally {
      setLoading(false)
    }
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <CheckCircle size={80} className="text-green-400 mx-auto" />
          <h1 className="text-4xl font-bold text-white">Order Complete!</h1>
          <p className="text-white/70">Thank you for your order. You'll receive a confirmation email shortly.</p>
          {pointsEarned > 0 && (
            <div className="bg-gold/20 border border-gold/30 rounded-xl p-4 mt-4">
              <p className="text-gold font-bold text-lg">🌟 You earned {pointsEarned} points!</p>
              <p className="text-white/70 text-sm">Keep shopping to earn more rewards.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text-animated">Checkout</span>
          </h1>
          <p className="text-xl text-white leading-relaxed text-enhanced-light">
            Complete your order and join the anime vault
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-primary">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">First Name</label>
                    <Input 
                      value={form.firstName}
                      onChange={(e) => setForm({...form, firstName: e.target.value})}
                      className="bg-black/40 border-gold/20 text-white focus:border-gold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Last Name</label>
                    <Input 
                      value={form.lastName}
                      onChange={(e) => setForm({...form, lastName: e.target.value})}
                      className="bg-black/40 border-gold/20 text-white focus:border-gold" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Email</label>
                  <Input 
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="bg-black/40 border-gold/20 text-white focus:border-gold" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Address</label>
                  <Input 
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    className="bg-black/40 border-gold/20 text-white focus:border-gold" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">City</label>
                    <Input 
                      value={form.city}
                      onChange={(e) => setForm({...form, city: e.target.value})}
                      className="bg-black/40 border-gold/20 text-white focus:border-gold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Postal Code</label>
                    <Input 
                      value={form.postalCode}
                      onChange={(e) => setForm({...form, postalCode: e.target.value})}
                      className="bg-black/40 border-gold/20 text-white focus:border-gold" 
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gold/20" />

              {/* Points Redemption */}
              {userId && userPoints > 0 && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                        <Star size={20} className="text-white" weight="fill" />
                      </div>
                      <h2 className="text-2xl font-bold gradient-text-primary">Redeem Points</h2>
                    </div>

                    <div className="bg-gold/10 border border-gold/20 rounded-xl p-4">
                      <p className="text-gold font-bold text-lg">{userPoints} points available</p>
                      <p className="text-white/50 text-xs">= ${(userPoints / 50).toFixed(2)} CAD off • Redeem in multiples of 50</p>
                    </div>

                    {pointsToRedeem > 0 ? (
                      <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <div>
                          <p className="text-green-400 font-bold">{pointsToRedeem} points applied!</p>
                          <p className="text-white/50 text-xs">-${(pointsToRedeem / 50).toFixed(2)} CAD discount</p>
                        </div>
                        <button
                          onClick={() => { setPointsToRedeem(0); setRedeemInput('') }}
                          className="text-red-400 text-sm hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Enter points (e.g. 50, 100, 150)"
                          value={redeemInput}
                          onChange={e => setRedeemInput(e.target.value)}
                          className="bg-black/40 border-gold/20 text-white"
                        />
                        <Button
                          onClick={handleRedeemPoints}
                          className="bg-gold text-black hover:bg-gold/90 shrink-0"
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                  <Separator className="bg-gold/20" />
                </>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-primary">Payment Information</h2>
                </div>

                <div 
                  id="card-container" 
                  ref={cardContainerRef}
                  className="p-4 bg-white rounded-lg min-h-[100px]"
                />

                {errorMessage && (
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text-primary">Order Summary</h2>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <p className="text-center text-white/70 py-8">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-gold/10">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.product.name}</h3>
                      <p className="text-sm text-white/70">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-gold font-bold">{format(item.product.price * item.quantity)}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash size={20} />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-6 bg-gold/20" />

            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Subtotal</span>
                <span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : format(shipping)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Tax (13%)</span>
                <span>{format(tax)}</span>
              </div>
              {pointsToRedeem > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Points Discount ({pointsToRedeem} pts)</span>
                  <span>-{format(pointsDiscount)}</span>
                </div>
              )}
              <Separator className="bg-gold/20" />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="gradient-text-primary">{format(total)}</span>
              </div>
              {userId && (
                <div className="flex justify-between text-sm text-gold">
                  <span>🌟 Points you'll earn</span>
                  <span>+{earnedPoints} points</span>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-8 h-14 text-lg font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-black shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300"
              disabled={cartItems.length === 0 || loading || !card}
              onClick={handlePayment}
            >
              {loading ? (
                <CircleNotch size={24} className="mr-2 animate-spin" />
              ) : (
                <CheckCircle size={24} className="mr-2" />
              )}
              {loading ? 'Processing...' : 'Complete Order'}
            </Button>

            <p className="text-center text-sm text-white/70 mt-4">
              Secured by Square — your payment info is encrypted
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
