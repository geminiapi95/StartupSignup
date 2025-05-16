import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface HeroSectionProps {
  waitlistCount: number;
}

export function HeroSection({ waitlistCount }: HeroSectionProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary-500 bg-clip-text text-transparent">
              Business
            </span>{" "}
            With Innovative Solutions
          </h1>
          <p className="mt-6 text-muted-foreground text-lg md:text-xl">
            Join thousands of forward-thinking companies leveraging our platform to streamline operations, increase productivity, and drive growth.
          </p>
          <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
            <Button
              onClick={() => scrollToSection('waitlist')}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary-600 text-white"
            >
              Join the Waitlist
            </Button>
            <Button
              onClick={() => scrollToSection('features')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Learn More <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </div>
          <div className="mt-8 flex items-center space-x-4 text-muted-foreground">
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-gray-400 text-white">JD</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-gray-400 text-white">AK</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-background">
                <AvatarFallback className="bg-gray-400 text-white">SR</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm">
              {waitlistCount > 0 
                ? `Joined by ${waitlistCount.toLocaleString()}+ people`
                : "Joined by 1,500+ companies"}
            </p>
          </div>
        </motion.div>
        <motion.div
          className="relative hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg 
            viewBox="0 0 1024 1024" 
            className="absolute -z-10 text-primary/5 w-full h-full"
            xmlns="http://www.w3.org/2000/svg" 
          >
            <path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
            <path fill="currentColor" d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
          </svg>
          <img 
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
            alt="Modern startup office" 
            className="w-full h-auto rounded-2xl shadow-xl"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs">
            <div className="flex items-center">
              <i className="ri-line-chart-line text-2xl text-secondary-500"></i>
              <div className="ml-3">
                <p className="text-foreground font-semibold">200% Growth</p>
                <p className="text-sm text-muted-foreground">Average customer results</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
