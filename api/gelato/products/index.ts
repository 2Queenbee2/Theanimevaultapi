// Gelato API - Get All Products (Vercel Serverless Function)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const GELATO_API_KEY = getEnv('GELATO_API_KEY')

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!GELATO_API_KEY) {
    return res.status(500).json({ error: 'Gelato API misconfigured' })
  }

  try {
    const response = await fetch('https://product.gelatoapis.com/v3/catalogs', {
      method: 'GET',
      headers: {
        'X-API-KEY': GELATO_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({ error: 'Gelato API error', details: errorText })
    }

    const data = await response.json()
    return res.status(200).json({ data: data, total: data.length || 0 })

  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
