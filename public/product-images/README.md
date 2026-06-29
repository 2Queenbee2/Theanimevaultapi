# Product Images Backup Folder

This folder contains backup images for Square products that fail to return images via the Square API.

## How it works
If Square does not return an image for a product, the system automatically looks for an image in this folder named after the product's SKU.

## How to add a backup image for a new product

1. Find the product's SKU in Square (go to the product → Variations → SKU column)
2. Compress the image to under 300KB using https://imageresizer.com/resize/editor
3. Rename the image file to the SKU number e.g. `T497014.png`
4. Upload it to this folder (Add file → Upload files)
5. Commit — the image will automatically show on the website!

## Example
- SKU: `T497014` → filename: `T497014.png` → Product: Rimuru Slime

## Notes
- Images must be PNG format
- Keep file size under 300KB for fast loading
- If Square fixes their image linking bug, the Square image will take priority automatically
- The SKU can be found in Square Dashboard → Items → click product → Variations section
