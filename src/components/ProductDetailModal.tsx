import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { useState, useMemo, useEffect } from 'react'
import { ShoppingCart, Star, Package, ShieldCheck, Heart } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (product: Product) => void
}

export function ProductDetailModal({ product, open, onOpenChange, onAddToCart }: ProductDetailModalProps) {
  const [selectedVariationId, setSelectedVariationId] = useState<string | undefined>(undefined)
  const [isFavourited, setIsFavourited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const selectedVariation = useMemo(() => {
    if (!product?.variations || !selectedVariationId) return undefined
    return product.variations.find(v => v.id === selectedVariationId)
  }, [product, selectedVariationId])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        if (product) checkFavourited(session.user.id, product.id)
      }
    })
  }, [product?.id])

  const checkFavourited = async (uid: string, productId: string) => {
    const { data } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', uid)
      .eq('product_id', productId)
      .single()
    setIsFavourited(!!data)
  }

  const handleFavourite = async () => {
    if (!userId) {
      toast.info('Sign in to save favourites!')
      return
    }
    if (!product) return

    setFavLoading(true)

    if (isFavourited) {
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', product.id)
      setIsFavourited(false)
      toast.success('Removed from favourites')
    } else {
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

  if (!product) return null

  const displayPrice = selectedVariation ? selectedVariation.price : product.price

  // Strip HTML tags from description
  const cleanDescription = (product.description || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.featured && (
              <Badge className="bg-gold text-gold-foreground border-0">
                ⭐ Featured Product
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gold/50 text-gold">
                    {product.category}
                  </Badge>
                  {!product.inStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {/* Heart button */}
                <button
                  onClick={handleFavourite}
                  disabled={favLoading}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all border",
                    isFavourited
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-background border-border text-muted-foreground hover:border-red-500 hover:text-red-500"
                  )}
                >
                  <Heart weight={isFavourited ? "fill" : "bold"} size={20} />
                </button>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    weight={i < Math.floor(product.rating) ? 'fill' : 'regular'}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(product.rating) ? 'text-gold' : 'text-muted-foreground'
                    )}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} out of 5
                </span>
              </div>

              <div className="text-4xl font-bold text-gold mb-6">
                ${Number(displayPrice).toFixed(2)}
              </div>

              {/* Variations */}
              {Array.isArray(product.variations) && product.variations.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select an option</label>
                  <select
                    className="w-full border border-border bg-background rounded-md p-2"
                    value={selectedVariationId || ''}
                    onChange={(e) => setSelectedVariationId(e.target.value || undefined)}
                  >
                    <option value="">Default</option>
                    {product.variations.map(v => (
                      <option key={v.id} value={v.id} disabled={!v.inStock}>
                        {v.name} {v.inStock ? '' : '(Out of stock)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {cleanDescription}
              </p>

              <Button
                size="lg"
                onClick={() => {
                  const p = selectedVariation
                    ? { ...product, name: `${product.name} - ${selectedVariation.name}`, price: selectedVariation.price }
                    : product
                  onAddToCart(p)
                  onOpenChange(false)
                }}
                disabled={!product.inStock}
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90 disabled:opacity-50 h-12 text-base"
              >
                <ShoppingCart weight="bold" className="mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Package weight="bold" className="text-gold" />
                <span className="text-muted-foreground">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck weight="bold" className="text-gold" />
                <span className="text-muted-foreground">100% authentic guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Star weight="bold" className="text-gold" />
                <span className="text-muted-foreground">Earn 1 point per $1 spent!</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
