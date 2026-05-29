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

  const { data, error, isLoading } = useSWR(
    token ? `https://headless.tebex.io/api/accounts/${token}/packages` : null,
    fetcher
  )

  if (!token) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-xl">VITE_TEBEX_PUBLIC_TOKEN is not configured</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-xl">Failed to load products</p>
        <p className="text-gray-400">Please check your Tebex configuration and try again.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse h-64" />
        ))}
      </div>
    )
  }

  const products: TebexPackage[] = data?.data || []

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white text-xl">No products found</p>
        <p className="text-gray-400">Add some packages to your Tebex store to see them here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => {
        const hasDiscount = product.sales_price !== null && product.sales_price < product.base_price
        const displayPrice = hasDiscount ? product.sales_price : product.base_price

        return (
          <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            
            <div className="p-4">
              <h3 className="text-white text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{product.category?.name || "Uncategorized"}</p>
              
              <div className="flex items-center gap-2 mt-4">
                <span className="text-gold text-xl font-bold">
                  {product.currency} {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-gray-500 line-through text-sm">
                    {product.currency} {formatPrice(product.base_price)}
                  </span>
                )}
              </div>
              
              <a
                href={`https://otherworlds-awakening-webstore.tebex.io/package/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full bg-gradient-to-r from-gold via-yellow-400 to-gold text-black font-bold py-2 px-4 rounded text-center hover:scale-105 transition-transform"
              >
                Buy Now
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
