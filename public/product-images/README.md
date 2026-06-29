# Product Images Backup Folder

This folder contains images for Gelato products displayed on the website.

## How it works
Each product image is named after its **Gelato Template ID** and must be a JPEG file.
The system automatically matches the image to the product using the template ID.

## How to add an image for a new product

1. Create your poster template in Gelato
2. Copy the **Template ID** from the 3-dot menu on the template card
3. Compress the image to under 300KB using https://imageresizer.com/resize/editor
4. Rename the image file to the Template ID e.g. `6dc978ea-62d8-4bdf-a702-df92a065c38a.jpeg`
5. Upload it to this folder (Add file → Upload files)
6. Add the product to the `GELATO_PRODUCTS` list in `api/gelato/products/index.ts`
7. Commit — the image will automatically show on the website!

## Example
- Template ID: `6dc978ea-62d8-4bdf-a702-df92a065c38a` → filename: `6dc978ea-62d8-4bdf-a702-df92a065c38a.jpeg` → Product: Rimuru Poster

## Notes
- Images must be JPEG format
- Keep file size under 300KB for fast loading
- The Template ID can be found by clicking the 3-dot menu on any template in Gelato → Copy template ID
- Images must be at least 75 DPI for
