import { useState, useEffect } from 'react'

// Types
interface TebexProduct {
  id: number
  name: string
  description: string
  image: string | null
  category: {
    id: number
    name: string
  }
  base_price: number
  sales_price: number
  currency: string
  discount: number
}

interface TebexResponse {
  data: TebexProduct[]
}

// Simple cn utility - or import from your existing utils
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// Loading skeleton component
function ProductSkeleton() {
  return (
    <div className="overflow-hidden bg-slate-900/20 backdrop-blur-md border border-cyan-500/20 rounded-lg">
      <div className="h-48 w-full bg-slate-800/20 animate-pulse" />
      <div className="p-4">
        <div className="h-6 w-3/4 bg-slate-800/20 animate-pulse rounded" />
        <div className="h-4 w-full bg-slate-800/20 animate-pulse rounded mt-4" />
        <div className="h-4 w-2/3 bg-slate-800/20 animate-pulse rounded mt-2" />
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 w-full bg-slate-800/20 animate-pulse rounded" />
      </div>
    </div>
  )
}

// Product card component
function ProductCard({ product }: { product: TebexProduct }) {
  const hasDiscount = product.discount > 0
  const cleanDescription = product.description
    .replace(/<[^>]*>/g, '')
    .substring(0, 100)

  return (
    <div className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:shadow-cyan-500/20 bg-slate-900/20 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/40 rounded-lg">
      <div className="relative h-48 bg-slate-800/20">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-16 w-16 text-cyan-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>
      <div className="p-4 pb-2">
        <h3 className="text-lg font-semibold line-clamp-2 text-white">{product.name}</h3>
        <span className="inline-block mt-2 text-xs bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 px-2 py-1 rounded">
          {product.category.name}
        </span>
      </div>
      <div className="px-4 flex-1">
        <p className="text-sm text-cyan-100/70 line-clamp-3">
          {cleanDescription}
        </p>
      </div>
      <div className="flex items-center justify-between p-4 pt-4 border-t border-cyan-500/20">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">
            {product.currency} {product.sales_price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-cyan-300/50 line-through">
              {product.currency} {product.base_price.toFixed(2)}
            </span>
          )}
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-yellow-500 active:to-amber-400 focus:from-yellow-500 focus:to-amber-400 text-white font-semibold rounded-md shadow-md transition-all duration-200"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Buy
        </button>
      </div>
    </div>
  )
}

// Main TebexProducts component
export default function TebexProducts() {
  const [products, setProducts] = useState<TebexProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      const token = import.meta.env.VITE_TEBEX_PUBLIC_TOKEN

      if (!token) {
        setError('VITE_TEBEX_PUBLIC_TOKEN is not configured')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('https://headless.tebex.io/api/accounts/' + token + '/packages')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data: TebexResponse = await response.json()
        setProducts(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/20 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <svg className="h-12 w-12 text-cyan-400/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="text-lg font-semibold text-white">Failed to load products</h3>
        <p className="text-sm text-cyan-100/70 mt-1">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/20 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <svg className="h-12 w-12 text-cyan-400/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="text-lg font-semibold text-white">No products found</h3>
        <p className="text-sm text-cyan-100/70 mt-1">
          Add some packages to your Tebex store to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
