import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import Banner from "@/components/features/ui/Banner";
import BriefGallery from "@/components/features/dashboard/components/BriefGallery";
import Footer from "@/components/features/ui/Footer";

export const metadata = {
  title: "Gallery - Dagbon Students Association",
  description: "Explore the visual history and events of the Dagbon Students Association.",
};

export default function GalleryPage() {
  return (
    <div className="text-stone-900  scrollbar-hide w-full overflow-hidden">
      <div className="pt-24 md:pt-20">
        <Banner />
        <BriefGallery style="side" />
      </div>
    </div>
  );
}
