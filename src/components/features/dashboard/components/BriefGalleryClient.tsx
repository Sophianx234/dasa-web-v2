"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [images, setImages] = useState<mediaType[]>(initialImages);

  const loadImgs = useCallback(
    async (pageNumber: number) => {
      if (!hasMore || isLoading) return;

      try {
        setIsLoading(true);
        // Call Server Action
        const data = await getGalleryAction(pageNumber, 12);
        
        const imgs = data.images || [];
        const numImages = data.numImages || 0;

        if (imgs.length === 0 || numImages === 0) {
          setHasMore(false);
        } else {
          // If page > 1, append images, else replace them
          setImages((prevImages) =>
            pageNumber === 1 ? imgs : [...prevImages, ...imgs],
          );
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isLoading],
  );

  const observerRef = useRef<IntersectionObserver | null>(null);

  const loaderRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    // We already have page 1 from initialImages, so only fetch when page > 1
    // or if we switch styles dynamically (unlikely but good practice)
    if (style !== "overview" && page > 1) {
      loadImgs(page);
    }
  }, [page, style, loadImgs]);

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

          <div ref={loaderRefCallback} className="w-full mt-4">
            {isLoading && <GallerySkeleton />}
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
