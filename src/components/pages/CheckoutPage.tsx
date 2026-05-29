import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CreditCard, MapPin, User, ShoppingBag, CheckCircle, Trash } from '@phosphor-icons/react'
import { useCurrency } from '@/lib/currency'
import { CartItem } from '@/lib/types'

// Setup the prop interface so it receives data from App.tsx
interface CheckoutPageProps {
  cartItems: CartItem[]
  onRemoveItem: (productId: string) => void
}

export function CheckoutPage({ cartItems = [], onRemoveItem }: CheckoutPageProps) {
  const { format } = useCurrency()

  // Calculate dynamic totals using actual cart items
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 9.99 : 0
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

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
          {/* Checkout Form - Restored shipping and payment fields */}
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              {/* Shipping Information */}
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
                    <Input className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Last Name</label>
                    <Input className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Email</label>
                  <Input type="email" className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Address</label>
                  <Input className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">City</label>
                    <Input className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Postal Code</label>
                    <Input className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                  </div>
                </div>
              </div>

              <Separator className="bg-gold/20" />

              {/* Payment Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-primary">Payment Information</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Card Number</label>
                  <Input placeholder="0000 0000 0000 0000" className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Expiry Date</label>
                    <Input placeholder="MM/YY" className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">CVV</label>
                    <Input placeholder="123" className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Cardholder Name</label>
                  <Input className="bg-black/40 border-gold/20 text-white focus:border-gold" />
                </div>
              </div>
            </form>
          </Card>

          {/* Order Summary - Dynamic with Delete Buttons */}
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
                    
                    {/* WORKING DELETE BUTTON */}
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
                <span>{format(shipping)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Tax</span>
                <span>{format(tax)}</span>
              </div>
              <Separator className="bg-gold/20" />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="gradient-text-primary">{format(total)}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-8 h-14 text-lg font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-black shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300"
              disabled={cartItems.length === 0}
            >
              <CheckCircle size={24} className="mr-2" />
              Complete Order
            </Button>

            <p className="text-center text-sm text-white/70 mt-4">
              Your payment information is secure and encrypted
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
