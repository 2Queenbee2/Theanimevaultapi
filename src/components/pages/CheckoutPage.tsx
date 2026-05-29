import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, CheckCircle, Trash } from '@phosphor-icons/react'
import { useCurrency } from '@/lib/currency'
import { CartItem } from '@/lib/types'

// Corrected Props to match App.tsx state structure perfectly
interface CheckoutPageProps {
  cartItems: CartItem[]
  onRemoveItem: (productId: string) => void
}

export function CheckoutPage({ cartItems = [], onRemoveItem }: CheckoutPageProps) {
  const { format } = useCurrency()
  
  // Corrected calculation accessing item.product.price
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
          {/* Checkout Form - keeping your existing form code */}
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
            {/* ... keep your existing form code ... */}
          </Card>

          {/* Order Summary - Updated and Corrected */}
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text-primary">Order Summary</h2>
            </div>

            <div className="space-y-4">
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
                    
                    {/* Corrected delete button calling handleRemoveItem with string ID */}
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
