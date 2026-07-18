import AboutHero from "@/components/about/AboutHero";
import BrandStory from "@/components/about/BrandStory";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import OrderingProcess from "@/components/about/OrderingProcess";
import ContactInfo from "@/components/about/ContactInfo";
import ContactForm from "@/components/about/ContactForm";
import FinalCTA from "@/components/about/FinalCTA";

export default function About() {
  return (
    <div>
      <AboutHero />
      <BrandStory />
      <WhyChooseUs />
      <OrderingProcess />
      <ContactInfo />
      <ContactForm />
      <FinalCTA />
    </div>
  );
}
