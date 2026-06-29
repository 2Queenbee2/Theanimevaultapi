import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass, CircleNotch, Warning } from '@phosphor-icons/react'

interface ShopPageProps {
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
}

const CATEGORY_ORDER = [
  'Posters',
  'Playmats',
  'Mouse Pads',
  'T-Shirts',
  'Backpacks',
  'Journals',
  'Car Accessories',
  'Other'
]

function getCategory(product: any): string {
  const name = (product.name || '').toLowerCase()
  const tags = (product.tags || []).map((t: any) => 
    typeof t === 'string' ? t.toLowerCase() : ''
  )
  const category = (product.category || '').toLowerCase()

  if (category === 'posters' || tags.includes('poster')) return 'Posters'
  if (name.includes('playmat') || (name.includes('desk') && name.includes('gaming'))) return 'Playmats'
  if (name.includes('mouse pad') || name.includes('led mouse')) return 'Mouse Pads'
  if (name.includes('tee') || name.includes('shirt') || tags.includes('t-shirts')) return 'T-Shirts'
  if (name.includes('backpack') || tags.includes('backpacks')) return 'Backpacks'
  if (name.includes('journal') || tags.includes('journals')) return 'Journals'
  if (name.includes('car seat') || tags.includes('car')) return 'Car Accessories'
  return 'Other'
}

export function ShopPage({ onAddToCart, onViewDetails }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const [gelatoRes, printifyRes] = await Promise.all([
        fetch('/api/gelato/products'),
        fetch('/api/printify/products')
      ])

      const gelatoData = gelatoRes.ok ? await gelatoRes.json() : { data: [] }
      const printifyData = printifyRes.ok ? await printifyRes.json() : { data: [] }

      const allProducts = [
        ...(gelatoData.data || []),
        ...(printifyData.data || [])
      ]

      // Deduplicate by ID only
      const seen = new Set()
      const unique = allProducts.filter(p => {
        if (seen.has(p.id)) return false
        seen.add(p.id)
        return true
      })

      setProducts(unique)
    } catch (err: any) {
      console.error('Failed to load products:', err)
      setError(`Failed to load products: ${err.message}`)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const categorized = products.map(p => ({ ...p, _category: getCategory(p) }))

  const filteredProducts = categorized.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || product._category === activeCategory
    return matchesSearch && matchesCategory
  })

  const availableCategories = ['All', ...CATEGORY_ORDER.filter(cat =>
    categorized.some(p => p._category === cat)
  )]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircleNotch className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Shop</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of premium anime merchandise
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded">
            <div className="flex items-center gap-2 text-orange-700">
              <Warning className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold text-black'
                  : 'bg-black/30 text-white hover:bg-black/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {activeCategory === 'All' ? (
          CATEGORY_ORDER.map(cat => {
            const catProducts = filteredProducts.filter(p => p._category === cat)
            if (catProducts.length === 0) return null
            return (
              <div key={cat} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white border-b border-gold/30 pb-2">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
