// Square Catalog API - Get All Products (Vercel Serverless Function)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const SQUARE_ACCESS_TOKEN = getEnv('SQUARE_ACCESS_TOKEN')
const SQUARE_LOCATION_ID = getEnv('SQUARE_LOCATION_ID')

interface SquareProduct {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  categories: Array<{ id: string; name: string; slug: string }>
  inStock: boolean
  featured: boolean
  tags: string[]
  sku: string
  variations: Array<{
    id: string
    name: string
    price: number
    inStock: boolean
    attributes: Record<string, string>
  }>
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!SQUARE_ACCESS_TOKEN) {
    return res.status(500).json({
      error: 'Square API misconfigured',
      details: 'Missing SQUARE_ACCESS_TOKEN in environment variables'
    })
  }

  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Square API Error:', response.status, errorText)
      return res.status(response.status).json({
        error: 'Square API request failed',
        details: `HTTP ${response.status}: ${errorText}`
      })
    }

    const data = await response.json()
    
    // Build a map of image_id -> image URL
    const imageMap = new Map<string, string>()
    const allObjects = Array.isArray(data.objects) ? data.objects : []
    for (const obj of allObjects) {
      if (obj?.type === 'IMAGE' && obj?.image_data?.url && obj?.id) {
        imageMap.set(obj.id, obj.image_data.url)
      }
    }

    const items = allObjects.filter((obj: any) => obj.type === 'ITEM') || []
    
    const products: SquareProduct[] = items.map((item: any) => {
      const itemData = item.item_data
      const variations = itemData?.variations || []
      
      const baseVariation = variations[0]
      const baseMoney = baseVariation?.item_variation_data?.price_money
      const basePrice = baseMoney ? baseMoney.amount / 100 : 0

      // Extract images - check item level first, then variation level as fallback
      const imageIds: string[] = itemData?.image_ids || []
      let images = imageIds.map((id: string) => imageMap.get(id)).filter(Boolean) as string[]

      // Fallback: check variation-level image_ids
      if (images.length === 0) {
        for (const variation of variations) {
          const uris = variation?.item_variation_data?.image_ids || []
          const found = uris.map((id: string) => imageMap.get(id)).filter(Boolean) as string[]
          if (found.length > 0) { images = found; break }
        }
      }

      const primaryImage = images[0] || 'https://placehold.co/400x600/1a1a1a/666666?text=No+Image'
      
      const categoryId = itemData?.category_id
      const category = categoryId ? 'General' : 'Uncategorized'
      
      const productVariations = variations.map((variation: any) => {
        const variationData = variation.item_variation_data
        const priceMoney = variationData?.price_money
        const price = priceMoney ? priceMoney.amount / 100 : 0
        
        return {
          id: variation.id,
          name: variationData?.name || 'Default',
          price: price,
          inStock: !variationData?.track_inventory || (variationData?.inventory_alert_threshold || 0) > 0,
          attributes: {
            sku: variationData?.sku || '',
            upc: variationData?.upc || ''
          }
        }
      })
      
      return {
        id: item.id,
        name: itemData?.name || 'Unnamed Product',
        description: itemData?.description || '',
        price: basePrice,
        originalPrice: basePrice,
        image: primaryImage,
        images: images,
        category: category,
        categories: [{ id: categoryId || 'general', name: category, slug: category.toLowerCase().replace(/\s+/g, '-') }],
        inStock: productVariations.some((v: any) => v.inStock),
        featured: true,
        tags: itemData?.categories || [],
        sku: baseVariation?.item_variation_data?.sku || item.id,
        variations: productVariations
      }
    })

    let filteredProducts = products
    
    const query = req.query || {}
    const search = query.search
    const category = query.category
    const featured = query.featured
    const limit = query.limit ?? '20'
    const offset = query.offset ?? '0'

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        (product.name || '').toLowerCase().includes(searchLower) ||
        (product.description || '').toLowerCase().includes(searchLower) ||
        (product.tags || []).some(tag => (tag || '').toLowerCase().includes(searchLower))
      )
    }

    if (category && typeof category === 'string') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured)
    }

    const limitNum = parseInt(limit as string) || 20
    const offsetNum = parseInt(offset as string) || 0
    const paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + limitNum)

    res.status(200).json({
      data: paginatedProducts,
      total: filteredProducts.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < filteredProducts.length
    })

  } catch (error: any) {
    console.error('Square Catalog API Error:', error)
    res.status(500).json({
      error: 'Failed to fetch products from Square',
      details: error.message
    })
  }
}
