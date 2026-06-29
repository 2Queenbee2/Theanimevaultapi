import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import TebexProducts from '@/components/TebexProducts'
import { ProductDetailModal } from '@/components/ProductDetailModal'
import { HomePage } from '@/components/pages/HomePage'
import { ShopPage } from '@/components/pages/ShopPage'
import { GamePage } from '@/components/pages/GamePage'
import { CheckoutPage } from '@/components/pages/CheckoutPage'
import { AccountPage } from '@/components/pages/AccountPage'
import { Product, CartItem } from '@/lib/types'
import { backgrounds, PageType } from '@/lib/backgrounds'
import { CurrencyProvider } from '@/lib/currency'

// ============================================
// STORE SETTINGS
// Set to true when Square payment is approved
// ============================================
const PAYMENTS_ENABLED = false

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', [])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/gelato/products')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        const products = (data.data || []).slice(-6).reverse()
        setFeaturedProducts(products)
      } catch (err) {
        console.error('Failed to load featured products:', err)
        setFeaturedProducts([])
      }
    }
    loadFeaturedProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    if (!PAYMENTS_ENABLED) {
      toast.info('Our store is coming soon! Payment processing is being set up.')
      return
    }
    if (!product.inStock) {
      toast.error('This item is currently out of stock')
      return
    }
    setCartItems((currentItems: CartItem[] = []) => {
      const existingItem = currentItems.find(item => item.product.id === product.id)
      if (existingItem) {
        toast.success('Updated quantity in cart')
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        toast.success('Added to cart')
        return [...currentItems, { product, quantity: 1 }]
      }
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((currentItems: CartItem[] = []) =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((currentItems: CartItem[] = []) => 
      currentItems.filter(item => item.product.id !== productId)
    )
    toast.success('Removed from cart')
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0)
  const currentBackground = backgrounds[currentPage as PageType] || backgrounds.home

  return (
    <CurrencyProvider>
      <div className="min-h-screen flex flex-col text-foreground relative">
        <div 
          className="page-background"
          style={{
            backgroundImage: `url(${currentBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        ></div>

        {/* Coming Soon Banner */}
        {!PAYMENTS_ENABLED && (
          <div className="bg-gold text-black text-center py-2 text-sm font-semibold z-50 relative">
            🛒 Our shop is almost open! Payment processing is being finalized. Browse our products now!
          </div>
        )}
        
        <Navbar
          cartCount={cartCount}
          onCartClick={() => {
            if (!PAYMENTS_ENABLED) {
              toast.info('Our store is coming soon! Payment processing is being set up.')
              return
            }
            setCartOpen(true)
          }}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        {currentPage === 'home' && (
          <HomePage
            onNavigate={setCurrentPage}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            featuredProducts={featuredProducts}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentPage === 'game' && <GamePage />}

        {currentPage === 'checkout' && (
          PAYMENTS_ENABLED ? (
            <CheckoutPage 
              cartItems={cartItems} 
              onRemoveItem={handleRemoveItem} 
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <h1 className="text-4xl font-bold text-white">Coming Soon!</h1>
                <p className="text-white/70 text-lg">We're finalizing our payment system. Check back soon!</p>
              </div>
            </div>
          )
        )}

        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'minecraft-shop' && <TebexProducts />}
        
        <Footer />

        <CartDrawer
          open={cartOpen}
          onOpenChange={setCartOpen}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {
            if (!PAYMENTS_ENABLED) {
              toast.info('Our store is coming soon!')
              return
            }
            setCurrentPage('checkout')
          }}
        />

        <ProductDetailModal
          product={selectedProduct}
          open={selectedProduct !== null}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />

        <Toaster position="top-right" richColors />
      </div>
    </CurrencyProvider>
  )
}

export default App
