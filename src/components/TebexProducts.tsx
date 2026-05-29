"use client"

import useSWR from "swr"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Package } from "lucide-react"
import type { TebexPackage } from "@/app/api/tebex/products/route"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden bg-slate-900/20 backdrop-blur-md border-cyan-500/20">
      <Skeleton className="h-48 w-full rounded-none bg-slate-800/20" />
      <CardHeader>
        <Skeleton className="h-6 w-3/4 bg-slate-800/20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2 bg-slate-800/20" />
        <Skeleton className="h-4 w-2/3 bg-slate-800/20" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full bg-slate-800/20" />
      </CardFooter>
    </Card>
  )
}

function ProductCard({ product }: { product: TebexPackage }) {
  const hasDiscount = product.sales_price !== null && product.sales_price < product.base_price
  const displayPrice = hasDiscount ? product.sales_price : product.base_price

  // Strip HTML tags from description for display
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>/g, "").slice(0, 150)
    : "No description available"

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg hover:shadow-cyan-500/20 bg-slate-900/20 backdrop-blur-md border-cyan-500/20 hover:border-cyan-400/40">
      <div className="relative h-48 bg-slate-800/20">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-cyan-400/50" />
          </div>
        )}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
            Sale
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 text-white">{product.name}</CardTitle>
        </div>
        <Badge variant="secondary" className="w-fit text-xs bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
          {product.category.name}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-cyan-100/70 line-clamp-3">
          {cleanDescription}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">
            {product.currency} {displayPrice?.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-cyan-300/50 line-through">
              {product.currency} {product.base_price.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          size="sm" 
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:from-yellow-500 active:to-amber-400 focus:from-yellow-500 focus:to-amber-400 text-white font-semibold border-0 shadow-md transition-all duration-200"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy
        </Button>
      </CardFooter>
    </Card>
  )
}

export function TebexProducts() {
  const { data, error, isLoading } = useSWR<{ data: TebexPackage[] }>(
    "/api/tebex/products",
    fetcher
  )

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/20 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <Package className="h-12 w-12 text-cyan-400/50 mb-4" />
        <h3 className="text-lg font-semibold text-white">Failed to load products</h3>
        <p className="text-sm text-cyan-100/70 mt-1">
          Please check your Tebex configuration and try again.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  const products = data?.data || []

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/20 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <Package className="h-12 w-12 text-cyan-400/50 mb-4" />
        <h3 className="text-lg font-semibold text-white">No products found</h3>
        <p className="text-sm text-cyan-100/70 mt-1">
          Add some packages to your Tebex store to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
