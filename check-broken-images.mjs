// Check which products have missing or broken image URLs
import dotenv from 'dotenv'
dotenv.config()

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

async function checkImages() {
  try {
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })
    
    const data = await response.json()
    const allObjects = data.objects || []
    
    // Build image map
    const imageMap = new Map()
    const images = allObjects.filter(obj => obj.type === 'IMAGE')
    
    console.log('🖼️  IMAGE OBJECTS:\n')
    images.forEach(img => {
      const url = img.image_data?.url
      if (url) {
        imageMap.set(img.id, url)
        console.log(`✅ ${img.id}: ${url.substring(0, 60)}...`)
      } else {
        console.log(`❌ ${img.id}: NO URL`)
      }
    })
    
    // Check products
    const items = allObjects.filter(obj => obj.type === 'ITEM')
    
    console.log('\n\n📦 PRODUCT IMAGE STATUS:\n')
    items.forEach(item => {
      const itemData = item.item_data
      const imageIds = itemData?.image_ids || []
      
      console.log(`\n${itemData?.name}`)
      console.log(`  Image IDs: ${JSON.stringify(imageIds)}`)
      
      if (imageIds.length === 0) {
        console.log(`  ❌ NO IMAGE IDS`)
      } else {
        imageIds.forEach(imgId => {
          const url = imageMap.get(imgId)
          if (url) {
            console.log(`  ✅ ${imgId}: HAS URL`)
          } else {
            console.log(`  ❌ ${imgId}: MISSING FROM IMAGE MAP`)
          }
        })
      }
    })
    
    // Products without valid images
    console.log('\n\n⚠️  PRODUCTS WITH MISSING IMAGES:\n')
    items.forEach(item => {
      const itemData = item.item_data
      const imageIds = itemData?.image_ids || []
      const hasValidImage = imageIds.some(id => imageMap.get(id))
      
      if (!hasValidImage) {
        console.log(`❌ ${itemData?.name} - ${imageIds.length > 0 ? 'Image IDs exist but no URLs' : 'No image IDs'}`)
      }
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkImages()
