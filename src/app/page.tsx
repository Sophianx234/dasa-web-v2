import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import Activities from "@/components/features/ui/Activities";
import Banner from "@/components/features/ui/Banner";
import BriefAbout from "@/components/features/ui/BriefAbout";
import CTA from "@/components/features/ui/CTA";
import CTAFooter from "@/components/features/ui/CTAFooter";
import Footer from "@/components/features/ui/Footer";
import Hero from "@/components/features/ui/Hero";
import Membership from "@/components/features/ui/Membership";
import Questions from "@/components/features/ui/Questions";
import Testimonials from "@/components/features/ui/Testimonials";
import BriefGallery from "@/components/features/dashboard/components/BriefGallery";

export default function Home() {
  return (
    <div className="text-stone-900 h-dvh scrollbar-hide overflow-x-hidden w-dvw">
      <NavigationWrapper />
      <main className="">
        <Hero />
        <BriefAbout />
        <CTA />
        <Membership />
        <Testimonials />
        <Activities />
        <CTAFooter />
        <Questions />
        <Banner />
        <BriefGallery style="overview"/>
        <Footer />
      </main>
    </div>
  );
}
