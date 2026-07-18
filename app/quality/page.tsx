
import QualityHero from "@/components/quality/QualityHero";
import AdvantagesSection from "@/components/quality/AdvantagesSection";
import ProductionProcess from "@/components/quality/ProductionProcess";
import QualityStandards from "@/components/quality/QualityStandards";
import ComparisonSection from "@/components/quality/ComparisonSection";
import FactoryGallery from "@/components/quality/FactoryGallery";
import QualityFAQ from "@/components/quality/QualityFAQ";
import CTASection from "@/components/home/CTASection";

export default function Quality() {
  return (
    <div>
      <QualityHero />
      <AdvantagesSection />
      <ProductionProcess />
      <QualityStandards />
      <ComparisonSection />
      <FactoryGallery />
      <QualityFAQ />
      <CTASection />
    </div>
  );
}
