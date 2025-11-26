# Square Product Images Not Loading - Technical Details

## Issue Summary
7 out of 18 products in the Square catalog have image references (`image_ids`) that point to non-existent IMAGE objects in the Square API response.

## Technical Details

### API Call Being Made
```
GET https://connect.squareup.com/v2/catalog/list?types=ITEM,IMAGE
Square-Version: 2023-12-13
```

### What We're Seeing
When we fetch the catalog, we receive:
- **18 ITEM objects** (products)
- **82 IMAGE objects** (images)

However, **7 products reference image IDs that don't exist** in the IMAGE objects returned.

## Affected Products

| Product Name | Image ID Referenced | Status |
|-------------|-------------------|--------|
| Nezuko Red Poster | `ZMFPLDYEXI6X4IHJKI5AB6C7` | ❌ Image object not found in API |
| AllMight Poster | `XP3V3YV3KRVQNG33FEZJ6DLY` | ❌ Image object not found in API |
| Korra Poster | `KTHSGUNMRQCNT2J2RMTPWE24` | ❌ Image object not found in API |
| Legends of Zelda Poster | `NY4S3KV3B5ACKXM4WNUU5X6G` | ❌ Image object not found in API |
| Rengoku Poster | `JDSCVTGLUUKWZOEUS4E6RG54` | ❌ Image object not found in API |
| Full Metal Alchemists Poster | `SETT35OIPPNSQFQUT43YTYDD` | ❌ Image object not found in API |
| Roronoa Zoro Sexy Poster | `7KFMK5SZ3IVDN7OOB6DXI7LZ` | ❌ Image object not found in API |

## What This Means

The ITEM objects have `image_ids` arrays like:
```json
{
  "id": "R2OX754RZR2N3YO5Y34KZJZC",
  "type": "ITEM",
  "item_data": {
    "name": "Nezuko Red Poster",
    "image_ids": ["ZMFPLDYEXI6X4IHJKI5AB6C7"]
  }
}
```

But when we look for IMAGE object with ID `ZMFPLDYEXI6X4IHJKI5AB6C7`, **it doesn't exist** in the API response.

## Possible Causes

1. **Orphaned References**: The image was deleted but the reference in `image_ids` wasn't cleaned up
2. **Image Processing State**: The image might be in a "processing" or "failed" state and not returned by the API
3. **Catalog Corruption**: Database inconsistency in Square's catalog
4. **Version/Location Mismatch**: The images might be associated with a different location or version

## What Needs to Be Checked in Square Dashboard

### For Each Affected Product:

1. **Open the product in Square Dashboard**
   - Go to: https://squareup.com/dashboard/items/library
   - Search for the product name (e.g., "Nezuko Red Poster")

2. **Check the Image Status**
   - Does the image show up in the dashboard?
   - Is there an error icon or warning?
   - Is the image still uploading or processing?

3. **Try Re-uploading the Image**
   - Delete the existing image reference
   - Upload the image again
   - Save the product

4. **Check for Image Errors**
   - File size too large (>5MB)?
   - Incorrect format (should be JPG, PNG, or GIF)?
   - Image dimensions too large?

### Image Requirements (Square Standards)
- **Max file size**: 5MB
- **Formats**: JPEG, PNG, GIF
- **Recommended**: At least 2048px on the longest side
- **Aspect ratio**: Square recommends 1:1 or 4:3

## API Response Example

### Working Product (Nezuko Poster):
```json
ITEM Object:
{
  "id": "REJSYUK2Z3WQP5X5U4CPQRVJ",
  "item_data": {
    "name": "Nezuko Poster",
    "image_ids": ["Q3444YZ7J6OBXP7X2WQUHRWZ"]
  }
}

IMAGE Object (exists):
{
  "id": "Q3444YZ7J6OBXP7X2WQUHRWZ",
  "type": "IMAGE",
  "image_data": {
    "url": "https://items-images-production.s3.us-west-2.amazonaws.com/files/..."
  }
}
```
✅ **This works** - image_id matches an existing IMAGE object

### Broken Product (Nezuko Red Poster):
```json
ITEM Object:
{
  "id": "R2OX754RZR2N3YO5Y34KZJZC",
  "item_data": {
    "name": "Nezuko Red Poster",
    "image_ids": ["ZMFPLDYEXI6X4IHJKI5AB6C7"]
  }
}

IMAGE Object:
(searching for ID "ZMFPLDYEXI6X4IHJKI5AB6C7"...)
❌ NOT FOUND in API response
```

## Temporary Solution Applied
We've added a placeholder image for products with missing images, so the website still functions. However, the real images need to be fixed in Square.

## Questions for Square Support

If the images appear fine in the Square Dashboard:

1. **Are these images in a "processing" state that prevents them from appearing in the API?**
2. **Could there be a delay in catalog synchronization?**
3. **Are the image IDs associated with a different location or environment?**
4. **Is there a way to force re-sync these specific IMAGE objects?**
5. **Can you verify these image IDs exist in your database?**
   - `ZMFPLDYEXI6X4IHJKI5AB6C7`
   - `XP3V3YV3KRVQNG33FEZJ6DLY`
   - `KTHSGUNMRQCNT2J2RMTPWE24`
   - `NY4S3KV3B5ACKXM4WNUU5X6G`
   - `JDSCVTGLUUKWZOEUS4E6RG54`
   - `SETT35OIPPNSQFQUT43YTYDD`
   - `7KFMK5SZ3IVDN7OOB6DXI7LZ`

## Environment Details
- **Square Location ID**: `L7Y14WN80ES21`
- **Square Environment**: Production
- **API Version**: `2023-12-13`
- **Access Token**: (valid - other products load fine)

## Next Steps

1. Check each affected product in Square Dashboard
2. Verify images are actually uploaded and visible
3. Try deleting and re-uploading images for affected products
4. If issue persists, contact Square Support with this document
5. Provide them with the specific image IDs that are missing

## IMPORTANT: After Re-uploading Images

When you re-upload an image in Square, it creates a **NEW image ID**. However, the product might still reference the **old (broken) image ID**.

### What to Check:

After re-uploading the image:

1. **In the product edit screen**, make sure the NEW image is actually **assigned/linked** to the product
2. The old broken image reference might still be there - you need to **remove it**
3. Then **add/select the newly uploaded image**
4. **Save the product** again

### The Issue:
- Old Image ID: `ZMFPLDYEXI6X4IHJKI5AB6C7` ❌ (broken)
- New Image ID: `[NEW_ID_AFTER_REUPLOAD]` ✅ (works)
- But product might still reference the old ID!

### Solution:
In Square Dashboard, for each affected product:
1. Click "Edit Product"
2. In the **Images section**, you might see both old and new images
3. **Remove the broken/old image** (if visible)
4. Make sure **only the new working image is selected**
5. Click **Save**

This will update the `image_ids` array in the product to point to the new working image.

---

**Contact Square Support**: https://squareup.com/help/contact
**API Documentation**: https://developer.squareup.com/reference/square/catalog-api
