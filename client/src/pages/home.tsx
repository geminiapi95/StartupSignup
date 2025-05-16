import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { AboutSection } from "@/components/about-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { WaitlistForm } from "@/components/waitlist-form";
import { Footer } from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // Get waitlist count
  const { data: waitlistData } = useQuery({
    queryKey: ['/api/waitlist/count'],
    staleTime: 60000, // Refresh data every minute
  });

  const waitlistCount = waitlistData?.count || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background-100 text-foreground bg-circuit">
      <Navbar />
      <main className="flex-grow">
        <HeroSection waitlistCount={waitlistCount} />
        <FeaturesSection />
        <AboutSection />
        <TestimonialsSection />
        <FAQSection />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
}
