import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import SocialProof from '@/components/home/SocialProof';
import AIShowcase from '@/components/home/AIShowcase';
import Categories from '@/components/home/Categories';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';
import DesignGallery from '@/components/home/DesignGallery';
import FAQSection from '@/components/home/FAQSection';
import FeatureHighlights from '@/components/home/FeatureHighlights';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <SocialProof />
      <FeatureHighlights />
      <AIShowcase />
      <Categories />
      <DesignGallery />
      <HowItWorks />
      <FAQSection />
      <CTASection />
    </div>
  );
}