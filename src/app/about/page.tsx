import NavigationWrapper from "@/components/features/ui/NavigationWrapper";
import AboutSection from "@/components/features/ui/AboutSection";
import ConstitutionSection from "@/components/features/ui/ConstitutionSection";
import ExecutivesSection from "@/components/features/ui/ExecutivesSection";
import Footer from "@/components/features/ui/Footer";
import Impact from "@/components/features/ui/Impact";
import Values from "@/components/features/ui/Values";

export const metadata = {
  title: "About DaSA - Dagbon Students Association",
  description: "Learn more about the Dagbon Students Association, our mission, values, and executives.",
};

export default function AboutPage() {
  return (
    <div className="text-stone-900 h-dvh scrollbar-hide overflow-x-hidden w-dvw">
      <NavigationWrapper />
      <main>
        <AboutSection />
        <ExecutivesSection />
        <Impact />
        <Values />
        <ConstitutionSection />
        <Footer />
      </main>
    </div>
  );
}
