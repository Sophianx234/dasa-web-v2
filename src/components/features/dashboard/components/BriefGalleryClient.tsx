"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { mediaType } from "@/services/apiServices";
import { shuffleArray } from "@/components/features/utils/helpers";
import GallerySkeleton from "@/skeletons/GallerySkeleton";
import Footer from "@/components/features/ui/Footer";
import ImageViewer from "./ImageViewer";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getGalleryAction } from "@/app/actions";

export type BriefGalleryProps = {
  style: "overview" | "side";
  initialImages?: mediaType[];
};

function BriefGalleryClient({ style, initialImages = [] }: BriefGalleryProps) {
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [images, setImages] = useState<mediaType[]>(initialImages);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    if (!hasMore || isPending) return;

    startTransition(async () => {
      try {
        const next = page + 1;
        const data = await getGalleryAction(next, 24);
        const imgs = data.images || [];

        if (imgs.length === 0) {
          setHasMore(false);
        } else {
          setImages((prevImages) => [...prevImages, ...imgs]);
          setPage(next);
          if (imgs.length < 24) setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setHasMore(false);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      {style === "overview" && (
        <div className="mx-4 mt-8 rounded-lg pb-6">
          <h2 className="text-2xl md:text-3xl hidden font-bold tracking-tight text-[#33312e] pb-6 pt-4 font-rethink">
            Gallery.
          </h2>
          <ImageViewer images={images} />
        </div>
      )}

      {style === "side" && (
        <div className="mx-4 rounded-lg pb-6 pt-20">
          <div className="pt-2">
            {images && images.length > 0 && <ImageViewer images={images} />}
          </div>

          <div className="w-full mt-8 flex justify-center">
            {isPending && <GallerySkeleton />}
            {!isPending && hasMore && images.length > 0 && (
              <button
                onClick={handleLoadMore}
                disabled={isPending}
                className="bg-[#33312e] text-white px-8 py-3 font-semibold font-poppins rounded-full hover:bg-black transition-colors disabled:opacity-50"
              >
                Load More
              </button>
            )}
          </div>

          {!hasMore && images && images.length > 0 && (
            <p className="text-center text-[#33312e]/50 text-sm font-poppins py-8">
              No more images to load.
            </p>
          )}

          <div className="pt-12">
            <Footer navType="dash" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default BriefGalleryClient;
