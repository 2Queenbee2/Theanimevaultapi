import { X, Plus, Minus, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { CartItem } from '@/lib/types'
import { useCurrency } from '@/lib/currency'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void // Added this new prop to handle navigation
}

export function CartDrawer({ 
  open, 
  onOpenChange, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout // Added this to the destructured props
}: CartDrawerProps) {
  const { format } = useCurrency()
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-black/95 border-gold/20 text-white h-[85vh] flex flex-col">
        <DrawerHeader className="border-b border-gold/20 flex justify-between items-center px-6 py-4">
          <DrawerTitle className="text-2xl font-bold gradient-text-primary">
            Shopping Cart ({items.length})
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-gold/10">
              <X size={24} />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <span className="text-6xl" role="img" aria-label="cart">
                🛒
              </span>
              <p className="text-xl text-white/70">Your cart is empty</p>
              <p className="text-sm text-white/50">Add some amazing anime merchandise!</p>
              <DrawerClose asChild>
                <Button className="bg-gold text-black hover:bg-yellow-400 font-bold px-6">
                  Browse Products
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-gold/10">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border border-gold/10" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{item.product.name}</h4>
                    <p className="text-sm text-gold font-medium">{format(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-gold/20 hover:border-gold hover:bg-gold/10" onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}>
                        <Minus size={14} />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-gold/20 hover:border-gold hover:bg-gold/10" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => onRemoveItem(item.product.id)}>
                    <Trash size={20} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gold/20 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="gradient-text-primary">{format(total)}</span>
            </div>
            {/* Updated Button to call onCheckout when clicked */}
            <DrawerClose asChild>
              <Button 
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-black font-bold h-12"
              >
                Proceed to Checkout
              </Button>
            </DrawerClose>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
