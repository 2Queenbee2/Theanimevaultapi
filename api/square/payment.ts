// Square Payment Processing API
declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const SQUARE_ACCESS_TOKEN = getEnv('SQUARE_ACCESS_TOKEN')
const SQUARE_LOCATION_ID = getEnv('SQUARE_LOCATION_ID')

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
    return res.status(500).json({ error: 'Square API misconfigured' })
  }

  const { sourceId, amount, currency = 'CAD', orderDetails } = req.body

  if (!sourceId || !amount) {
    return res.status(400).json({ error: 'Missing sourceId or amount' })
  }

  try {
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-12-13'
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency
        },
        location_id: SQUARE_LOCATION_ID,
        note: `The Anime Vault Order - ${orderDetails?.items?.length || 0} items`
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Square payment error:', data)
      return res.status(response.status).json({
        error: 'Payment failed',
        details: data.errors?.[0]?.detail || 'Unknown error'
      })
    }

    return res.status(200).json({
      success: true,
      paymentId: data.payment?.id,
      status: data.payment?.status,
      receiptUrl: data.payment?.receipt_url
    })

  } catch (error: any) {
    console.error('Payment processing error:', error)
    return res.status(500).json({ error: error.message })
  }
}
