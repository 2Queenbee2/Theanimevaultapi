import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { TebexProducts } from '@/components/TebexProducts'
import { ProductDetailModal } from '@/components/ProductDetailModal'
import { HomePage } from '@/components/pages/HomePage'
import { ShopPage } from '@/components/pages/ShopPage'
import { GamePage } from '@/components/pages/GamePage'
import { CheckoutPage } from '@/components/pages/CheckoutPage'
import { AccountPage } from '@/components/pages/AccountPage'
import { products as localProducts } from '@/lib/products'
import { Product, CartItem } from '@/lib/types'
import { backgrounds, PageType } from '@/lib/backgrounds'
import { squareService, convertSquareProduct } from '@/lib/square'
import { CurrencyProvider } from '@/lib/currency'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', [])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    (localProducts || []).filter(p => p.featured).slice(0, 6)
  )

  const handleAddToCart = (product: Product) => {
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
    setCartItems((currentItems: CartItem[] = []) => currentItems.filter(item => item.product.id !== productId))
    toast.success('Removed from cart')
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0)

  // Load featured products from Square for the Home Featured Collection
  const loadFeaturedFromSquare = async () => {
    try {
      // Fetch featured products from Square
      const { data } = await squareService.getFeaturedProducts(6)
      const converted = data.map(convertSquareProduct)
      if (converted.length > 0) {
        setFeaturedProducts(converted)
      }
    } catch (err) {
      console.error('Failed to load Square featured products:', err)
      // Graceful fallback: keep existing local featuredProducts
    }
  }

  // Fetch on first mount
  useState(() => {
    // Slight delay to allow initial render, avoid blocking
    setTimeout(() => {
      loadFeaturedFromSquare()
    }, 0)
    return undefined
  })

  // Get current background image
  const currentBackground = backgrounds[currentPage as PageType] || backgrounds.home

  return (
    <CurrencyProvider>
    <div className="min-h-screen flex flex-col text-foreground relative">
      {/* Dynamic background */}
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
      
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 page-content">
        {currentPage === 'home' && (
          <HomePage
            featuredProducts={featuredProducts}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        )}
        
        {currentPage === 'game' && <GamePage />}
        
        {currentPage === 'checkout' && <CheckoutPage />}
        
        {currentPage === 'account' && <AccountPage />}

        {currentPage === 'minecraft-shop' && <TebexProducts />}

      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems || []}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
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
