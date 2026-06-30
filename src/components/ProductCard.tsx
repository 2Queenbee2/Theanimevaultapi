import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Heart } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { useCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const { format } = useCurrency()
  const [isFavourited, setIsFavourited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        checkFavourited(session.user.id)
      }
    })
  }, [product.id])

  const checkFavourited = async (uid: string) => {
    const { data } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', uid)
      .eq('product_id', product.id)
      .single()
    setIsFavourited(!!data)
  }

  const handleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!userId) {
      toast.info('Sign in to save favourites!')
      return
    }

    setFavLoading(true)

    if (isFavourited) {
      // Remove from favourites
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', product.id)
      setIsFavourited(false)
      toast.success('Removed from favourites')
    } else {
      // Add to favourites
      const { error } = await supabase
        .from('favourites')
        .insert({
          user_id: userId,
          product_id: product.id,
          product_name: product.name,
          product_image: product.image,
          product_price: product.price,
          fulfillment: (product as any).fulfillment || 'printify'
        })
      if (error) {
        toast.error('Failed to save favourite')
      } else {
        setIsFavourited(true)
        toast.success('Added to favourites! ❤️')
      }
    }

    setFavLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-border hover:border-gold/50 transition-all duration-300 cursor-pointer bg-card relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
        
        {product.featured && (
          <Badge className="absolute top-3 left-3 z-20 bg-gold text-gold-foreground border-0">
            Featured
          </Badge>
        )}
        
        {!product.inStock && (
          <Badge className="absolute top-3 right-3 z-20 bg-destructive text-destructive-foreground border-0">
            Out of Stock
          </Badge>
        )}

        <div 
          className="relative aspect-square overflow-hidden bg-secondary"
          onClick={() => onViewDetails(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <button
            onClick={handleFavourite}
            disabled={favLoading}
            className={cn(
              "absolute top-3 right-3 z-20 w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-all",
              isFavourited
                ? "bg-red-500 text-white opacity-100"
                : "bg-background/80 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
            )}
          >
            <Heart weight={isFavourited ? "fill" : "bold"} size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3 relative z-20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-foreground line-clamp-2 group-hover:text-gold transition-colors"
                onClick={() => onViewDetails(product)}
              >
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                weight={i < Math.floor(product.rating) ? 'fill' : 'regular'}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(product.rating) ? 'text-gold' : 'text-muted-foreground'
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({product.rating})</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-gold">{format(product.price)}</span>
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className="bg-gold text-gold-foreground hover:bg-gold/90 disabled:opacity-50"
            >
              <ShoppingCart weight="bold" className="mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
