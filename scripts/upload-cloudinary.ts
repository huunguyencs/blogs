import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function upload() {
  const imageUrl = process.argv[2];
  const slug = process.argv[3] || 'untitled';

  if (!imageUrl) {
    console.error('Usage: npx tsx scripts/upload-cloudinary.ts <image-url> <slug>');
    process.exit(1);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('ERROR: Missing Cloudinary credentials. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
    process.exit(1);
  }

  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'blog',
      public_id: slug,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      ],
    });

    // Output JSON so the caller can parse it
    console.log(JSON.stringify({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    }));
  } catch (error: any) {
    console.error(`Upload failed: ${error.message}`);
    process.exit(1);
  }
}

upload();
