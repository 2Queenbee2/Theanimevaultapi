// Fetch ALL products from Square to see what's available
import dotenv from 'dotenv'
dotenv.config()

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

async function getAllSquareProducts() {
  try {
    console.log('🔍 Fetching ALL products from Square Catalog API...\n')
    
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })
    
    const data = await response.json()
    
    console.log(`📦 Total objects received: ${data.objects?.length || 0}`)
    
    const items = data.objects?.filter(obj => obj.type === 'ITEM') || []
    console.log(`🎯 ITEM objects (products): ${items.length}\n`)
    
    console.log('📋 All Products in Square:\n')
    items.forEach((item, index) => {
      const itemData = item.item_data
      const variations = itemData?.variations || []
      const baseVariation = variations[0]
      const baseMoney = baseVariation?.item_variation_data?.price_money
      const price = baseMoney ? (baseMoney.amount / 100).toFixed(2) : '0.00'
      
      console.log(`${index + 1}. ${itemData?.name || 'Unnamed'}`)
      console.log(`   ID: ${item.id}`)
      console.log(`   Price: €${price}`)
      console.log(`   Description: ${itemData?.description || 'No description'}`)
      console.log(`   Variations: ${variations.length}`)
      console.log(`   In Stock: ${variations.some(v => !v.item_variation_data?.track_inventory)}`)
      console.log('')
    })
    
    if (items.length === 0) {
      console.log('❌ No products found in Square catalog!')
      console.log('   Add products in Square Dashboard: https://squareup.com/dashboard/items/library')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

getAllSquareProducts()
