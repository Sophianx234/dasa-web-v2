"use server";

import connectToDatabase from "@/lib/mongoose";
import { Media } from "@/models/Media";

export async function getVideosAction() {
  try {
    await connectToDatabase();
    
    // Fetch mp4s directly from MongoDB (same logic as dasa-api getAllVideos)
    const videos = await Media.find({ format: "mp4" }).sort({ order: 1 }).lean();
    
    // lean() returns standard JS objects instead of mongoose documents, which is required for Server Actions to pass to Client Components.
    // Also we need to convert _id from ObjectId to string
    const serializedVideos = videos.map(video => ({
      ...video,
      _id: video._id.toString()
    }));
    
    return { status: "success", numVideos: serializedVideos.length, videos: serializedVideos };
  } catch (error) {
    console.error("Server Action getVideosAction Error:", error);
    return { status: "error", numVideos: 0, videos: [] };
  }
}

export async function getGalleryAction(page = 1, limit = 12) {
  try {
    await connectToDatabase();
    
    const skip = (page - 1) * limit;
    
    // Fetch jpgs directly from MongoDB (same logic as dasa-api getAllImages)
    const images = await Media.find({ format: "jpg" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
    const totalImages = await Media.countDocuments({ format: "jpg" });
    
    const serializedImages = images.map(image => ({
      ...image,
      _id: image._id.toString()
    }));
    
    return { status: "success", numImages: totalImages, images: serializedImages };
  } catch (error) {
    console.error("Server Action getGalleryAction Error:", error);
    return { status: "error", numImages: 0, images: [] };
  }
}

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_PUBLIC_API_KEY,
  api_secret: process.env.CLOUDINARY_PRIVATE_API_KEY,
});

export async function uploadMediaAction(formData: FormData) {
  try {
    await connectToDatabase();
    
    // We expect files to be appended as "file" or "files" in formData
    const files = formData.getAll('file') as File[];
    if (!files || files.length === 0) return { status: "error", message: "No files found" };

    const results = [];
    
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const format = file.type.split("/")[0] as "video" | "image" | "raw";
      
      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: format === 'image' ? `Dasa/media/images` : format === 'video' ? `Dasa/media/videos` : `Dasa/media/raw`,
            resource_type: format,
          },
          (error, result) => {
            if (error || !result) reject(error || new Error("Cloudinary upload failed"));
            else resolve(result);
          }
        ).end(buffer);
      });
      
      // Save to MongoDB Media Collection (like dasa-api Media.create)
      const media = await Media.create(uploadResult);
      results.push({
        ...media.toObject(),
        _id: media._id.toString()
      });
    }
    
    // Revalidate paths since we added new media
    revalidatePath("/");
    revalidatePath("/dashboard/gallery");

    return { status: "success", message: "uploaded successfully", data: results };
  } catch (error) {
     console.error("Server Action uploadMediaAction Error:", error);
     return { status: "error", message: "Upload failed" };
  }
}
