import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import AboutHero from "@/components/features/ui/AboutHero";
import AboutSection from "@/components/features/ui/AboutSection";
import ConstitutionSection from "@/components/features/ui/ConstitutionSection";
import ExecutivesSection from "@/components/features/ui/ExecutivesSection";
import Footer from "@/components/features/ui/Footer";
import Impact from "@/components/features/ui/Impact";
import Values from "@/components/features/ui/Values";
import FeaturesBanner from "@/components/features/ui/FeaturesBanner";

export const metadata = {
  title: "About Us",
  description: "Learn more about the Dagbon Students Association, our mission, values, and executives.",
};

export default function AboutPage() {
  return (
    <div className="text-stone-900 min-h-screen scrollbar-hide w-full">
      <main>
        <AboutHero />
        <FeaturesBanner/>
        <AboutSection />
        <ExecutivesSection />
        <Impact />
        <Values />
        <ConstitutionSection />
      </main>
    </div>
  );
}
