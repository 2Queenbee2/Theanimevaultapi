// Gelato Products API - Get All Products (Vercel Serverless Function)
declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const GELATO_API_KEY = getEnv('GELATO_API_KEY')

// Your Gelato poster products
const GELATO_PRODUCTS = [
  { id: 'nami', name: 'Nami Poster', templateId: 'a19dc6b0-9f4e-4859-ba2f-8aa0684f17cc', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'kakashi', name: 'Kakashi Poster', templateId: 'b5acac16-b73d-478f-81b0-3a5d77fae0a9', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'itachi', name: 'Itachi Poster', templateId: '5a59e5cb-9d50-4d13-8c0c-85f3be7229ec', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'gojo', name: 'Gojo Poster', templateId: 'dae66722-45f3-45d2-b8bc-101066a88ebb', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'daki', name: 'Daki Poster', templateId: '7823fb53-ed87-49db-9784-16fdb37811fb', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'tifa', name: 'Tifa Poster', templateId: 'cb4eb6a7-7dc3-46dc-9a77-26503718b33c', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'naruto', name: 'Naruto Poster', templateId: '51346f09-f5ce-48ca-b661-de175538468b', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'eren', name: 'Eren Poster', templateId: '1a0024f6-d616-4290-adc3-82eb91a6cd5d', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'asuna', name: 'Asuna Poster', templateId: 'fdb7433b-ee1b-4c0d-89e4-2f38a596f257', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'nezuko', name: 'Nezuko Poster', templateId: '00eed4ce-18b3-46ba-93db-5f0d4b00154b', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'bakugo', name: 'Bakugo Poster', templateId: '2b925cef-d17a-468c-ae38-a144409fac13', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'nezuko-pink', name: 'Nezuko Pink Poster', templateId: '584e6b63-a4c6-4dfc-88de-665e930af0c4', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
  { id: 'rimuru', name: 'Rimuru Poster', templateId: '6dc978ea-62d8-4bdf-a702-df92a065c38a', price: 30, productUid: 'flat_a0_170-gsm-65lb-coated-silk_4-0_ver' },
]

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!GELATO_API_KEY) {
    return res.status(500).json({ error: 'Gelato API misconfigured' })
  }

  try {
    const products = await Promise.all(GELATO_PRODUCTS.map(async (product) => {
      // Use template ID for image filename
      const image = `/product-images/${product.templateId}.jpeg`

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: image,
        images: [image],
        category: 'Posters',
        categories: [{ id: 'posters', name: 'Posters', slug: 'posters' }],
        inStock: true,
        featured: true,
        description: 'Premium A0 Classic Semi-Glossy Paper Poster. 170 gsm paper weight, FSC-certified, shipped in robust packaging.',
        tags: ['poster', 'anime'],
        sku: product.id,
        templateId: product.templateId,
        productUid: product.productUid,
        fulfillment: 'gelato',
        variations: [
          {
            id: `${product.id}-a0`,
            name: 'A0 (84.1 x 118.9 cm) - Vertical',
            price: product.price,
            inStock: true,
            attributes: { sku: product.id }
          }
        ]
      }
    }))

    return res.status(200).json({
      data: products,
      total: products.length,
      limit: products.length,
      offset: 0,
      hasMore: false
    })

  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
