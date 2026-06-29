declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const PRINTIFY_ACCESS_TOKEN = getEnv('PRINTIFY_ACCESS_TOKEN')

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const response = await fetch('https://api.printify.com/v1/shops.json', {
      headers: { 'Authorization': `Bearer ${PRINTIFY_ACCESS_TOKEN}` }
    })
    const data = await response.json()
    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
