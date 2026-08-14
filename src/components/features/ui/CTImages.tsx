import Image from "next/image";

export type CTImagesProps = {
  imageUrl: string;
  className?: string;
};
function CTImages({ imageUrl, className }: CTImagesProps) {
  return <Image src={imageUrl} alt="" width={32} height={32} sizes="(max-width: 768px) 100vw, 50vw" className={className || "size-8 rounded-full"} />;
}

export default CTImages;
