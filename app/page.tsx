import HeroSection from "@/components/home/HeroSection";
import SocialProof from "@/components/home/SocialProof";
import FeatureHighlights from "@/components/home/FeatureHighlights";
import AIShowcase from "@/components/home/AIShowcase";
import Categories from "@/components/home/Categories";
import DesignGallery from "@/components/home/DesignGallery";
import HowItWorks from "@/components/home/HowItWorks";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import Testimonials from "@/components/home/Testimonials";
import QualityHighlights from "@/components/home/QualityHighlights";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SocialProof />
      <FeatureHighlights />
      <AIShowcase />
      <Categories />
      <QualityHighlights />
      <DesignGallery />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </div>
  );
}
