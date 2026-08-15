// lib/cloudinary.ts
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

function bufferToStream(buffer: Buffer) {
  return Readable.from(buffer);
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  userId: string | undefined,
  imagePath: string
) {
  return new Promise((resolve, reject) => {
    const publicId = userId || uuidv4(); // Unique ID if not overwriting
    const shouldOverwrite = Boolean(userId); // Only overwrite if userId given

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `rammys-closet/${imagePath}`,
        public_id: publicId,
        overwrite: shouldOverwrite,
        invalidate: shouldOverwrite, // Only invalidate cache if overwriting
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadApiResponse);
      }
    );

    bufferToStream(buffer).pipe(stream);
  });
}
export default cloudinary;
