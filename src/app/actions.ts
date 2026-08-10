"use server";

const API_URL = process.env.API_URL || "https://dasa-api.onrender.com/api/v1";

export async function getVideosAction() {
  try {
    const res = await fetch(`${API_URL}/media/videos?field=_id,secure_url,public_id,format`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Server Action getVideosAction Error:", error);
    return { status: "error", numVideos: 0, videos: [] };
  }
}

export async function getGalleryAction(page = 1, limit = 12) {
  try {
    const res = await fetch(`${API_URL}/media/images?field=_id,secure_url,public_id,format,created_at&page=${page}&limit=${limit}`, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch gallery: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Server Action getGalleryAction Error:", error);
    return { status: "error", numImages: 0, images: [] };
  }
}
