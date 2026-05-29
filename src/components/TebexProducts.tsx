import useSWR from "swr"
import { useState } from "react"

interface TebexPackage {
  id: number
  name: string
  description: string
  image: string | null
  base_price: number
  sales_price: number | null
  currency: string
  category: {
    id: number
    name: string
  }
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "0.00"
  return Number(price).toFixed(2)
}

export default function TebexProducts() {
  const token = import.meta.env.VITE_TEBEX_PUBLIC_TOKEN
  const [activeCategory, setActiveCategory] = useState("All")

  const { data, error, isLoading } = useSWR(
    token ? `https://headless.tebex.io/api/accounts/${token}/packages` : null,
    fetcher
  )

  if (!token) {
    return (
      <div className="flex items-center justify-center p-8 bg-black/40 border border-gold/20 rounded-xl text-white max-w-md mx-auto my-12">
        <p className="text-md font-semibold text-red-400">VITE_TEBEX_PUBLIC_TOKEN is not configured</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-gold/20 rounded-xl text-white space-y-2 max-w-md mx-auto my-12">
        <p className="text-md font-semibold text-red-400">Failed to load products</p>
        <p className="text-xs text-white/70">Please check your Tebex configuration and try again.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Skeleton Filter Bar */}
        <div className="flex gap-2 justify-center animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-24 h-9 bg-black/40 border border-gold/10 rounded-lg"></div>
          ))}
        </div>
        {/* Skeleton Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-black/40 border border-gold/10 rounded-xl h-80"></div>
          ))}
        </div>
      </div>
    )
  }

  const products: TebexPackage[] = data?.data || []

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-black/40 border border-gold/20 rounded-xl text-white space-y-2 max-w-md mx-auto my-12">
        <p className="text-lg font-bold">No products found</p>
        <p className="text-xs text-white/70">Add some packages to your Tebex store to see them here.</p>
      </div>
    )
  }

  // 1. Get unique categories directly from your Tebex products
  const uniqueCategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)))
  ]

  // 2. Filter products based on selected tab
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category?.name === activeCategory)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-gold/10 pb-6">
        {uniqueCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              activeCategory === category
                ? "bg-gold text-black border-gold shadow-md shadow-gold/30"
                : "bg-black/30 text-white/70 border-gold/20 hover:text-white hover:border-gold/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-white/50 py-12">
          No items found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const hasDiscount = product.sales_price !== null && product.sales_price !== undefined
            const displayPrice = hasDiscount ? product.sales_price : product.base_price

            return (
              <div
                key={product.id}
                className="flex flex-col bg-black/40 backdrop-blur-sm border border-gold/20 rounded-xl overflow-hidden shadow-lg hover:border-gold/50 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-video md:aspect-square max-h-56 bg-black/30 flex items-center justify-center border-b border-gold/10 p-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-white/40 text-sm flex flex-col items-center gap-2">
                      <span className="text-3xl">📦</span>
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1 hover:text-gold transition-colors duration-200">
                      {product.name}
                    </h3>
                    <span className="inline-block mt-1.5 text-[10px] font-bold tracking-wider uppercase bg-gold/10 border border-gold/20 text-gold px-2 py-0.5 rounded-full">
                      {product.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  {/* Price & Buy Button */}
                  <div className="flex items-end justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-white">
                        {product.currency} {formatPrice(displayPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-white/50 line-through mt-0.5">
                          {product.currency} {formatPrice(product.base_price)}
                        </span>
                      )}
                    </div>

                    <a
                      href={`https://otherworlds-awakening-webstore.tebex.io/package/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-black text-xs font-bold px-4 py-2.5 rounded-lg transition-all duration-300"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
