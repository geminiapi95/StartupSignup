import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <span className="ml-2 text-xl font-heading font-semibold">Innovate</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </button>
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              Admin
            </Link>
            <Button onClick={() => scrollToSection('waitlist')} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
              Join Waitlist
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-muted-foreground hover:text-primary">
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-b border-gray-200 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button 
            onClick={() => scrollToSection('features')} 
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-background-100"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-background-100"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-background-100"
          >
            FAQ
          </button>
          <Link 
            href="/admin"
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-background-100"
          >
            Admin
          </Link>
          <button 
            onClick={() => scrollToSection('waitlist')} 
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-600"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </nav>
  );
}
