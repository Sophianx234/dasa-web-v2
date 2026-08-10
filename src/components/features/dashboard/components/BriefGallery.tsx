import BriefGalleryClient from "./BriefGalleryClient";
import { getGalleryAction } from "@/app/actions";
import { shuffleArray } from "@/components/features/utils/helpers";
import { mediaType } from "@/services/apiServices";

export default async function BriefGallery({ style }: { style: "overview" | "side" }) {
  const data = await getGalleryAction(1, 12);
  let initialImages = data?.images || [];
  
  if (style === "overview" && initialImages.length > 0) {
    // Shuffle and pick 3 for overview style
    initialImages = shuffleArray([...initialImages], 3) as mediaType[];
  }
  
  return <BriefGalleryClient style={style} initialImages={initialImages} />;
}
