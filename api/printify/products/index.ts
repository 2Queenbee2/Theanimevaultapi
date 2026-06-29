declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const PRINTIFY_ACCESS_TOKEN = getEnv('PRINTIFY_ACCESS_TOKEN')
const PRINTIFY_SHOP_ID = getEnv('PRINTIFY_SHOP_ID')

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!PRINTIFY_ACCESS_TOKEN || !PRINTIFY_SHOP_ID) {
    return res.status(500).json({ error: 'Printify API misconfigured' })
  }

  try {
    let allItems: any[] = []
    let page = 1
    let hasMore = true

    // Fetch all pages
    while (hasMore) {
      const response = await fetch(
        `https://api.printify.com/v1/shops/${PRINTIFY_SHOP_ID}/products.json?page=${page}&limit=50`,
        { headers: { 'Authorization': `Bearer ${PRINTIFY_ACCESS_TOKEN}` } }
      )

      if (!response.ok) {
        const errorText = await response.text()
        return res.status(response.status).json({ error: 'Printify API error', details: errorText })
      }

      const data = await response.json()
      const items = data.data || []
      allItems = [...allItems, ...items]

      // Check if there are more pages
      if (items.length < 50 || allItems.length >= data.total) {
        hasMore = false
      } else {
        page++
      }
    }

    const products = allItems.map((item: any) => ({
      id: item.id,
      name: item.title,
      description: item.description || '',
      price: (item.variants?.[0]?.price || 0) / 100,
      image: item.images?.[0]?.src || 'https://placehold.co/400x600/1a1a1a/666666?text=No+Image',
      images: (item.images || []).map((img: any) => img.src),
      inStock: item.variants?.some((v: any) => v.is_enabled),
      tags: item.tags || [],
      variants: (item.variants || []).map((v: any) => ({
        id: v.id, name: v.title, price: v.price / 100, inStock: v.is_enabled
      }))
    }))

    return res.status(200).json({ data: products, total: products.length })

  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
