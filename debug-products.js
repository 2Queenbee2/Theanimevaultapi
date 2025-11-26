// Debug script to see raw Square product data including images
import dotenv from 'dotenv'
dotenv.config()

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

async function debugProducts() {
  try {
    console.log('🔍 Fetching products with image data...\n')
    
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })
    
    const data = await response.json()
    
    console.log(`📦 Total objects: ${data.objects?.length || 0}\n`)
    
    const items = data.objects?.filter(obj => obj.type === 'ITEM') || []
    const images = data.objects?.filter(obj => obj.type === 'IMAGE') || []
    
    console.log(`🎯 Items: ${items.length}`)
    console.log(`🖼️  Images: ${images.length}\n`)
    
    console.log('=== IMAGES ===\n')
    images.forEach(img => {
      console.log(`Image ID: ${img.id}`)
      console.log(`Name: ${img.image_data?.name || 'No name'}`)
      console.log(`URL: ${img.image_data?.url || 'No URL'}`)
      console.log('')
    })
    
    console.log('\n=== PRODUCTS ===\n')
    items.forEach(item => {
      const itemData = item.item_data
      console.log(`Product: ${itemData?.name}`)
      console.log(`ID: ${item.id}`)
      console.log(`Image IDs: ${JSON.stringify(itemData?.image_ids || [])}`)
      console.log(`Report URL: ${itemData?.report_url || 'None'}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

debugProducts()