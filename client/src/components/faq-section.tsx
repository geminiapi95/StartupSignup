import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "When will Innovate launch?",
      answer: "We're targeting a public launch in Q2 2023. Join our waitlist to be among the first to get access to our platform and receive exclusive early-bird offers."
    },
    {
      question: "What industries do you serve?",
      answer: "Our platform is designed to be industry-agnostic and has been successfully implemented in technology, healthcare, finance, manufacturing, retail, and professional services sectors."
    },
    {
      question: "Is Innovate suitable for small businesses?",
      answer: "Absolutely! We offer scalable plans that cater to businesses of all sizes. Our platform is specifically designed to provide enterprise-level capabilities to growing businesses without the enterprise price tag."
    },
    {
      question: "How secure is my business data?",
      answer: "Security is our top priority. We employ bank-level encryption, regular security audits, and comply with GDPR, CCPA, and other regional data protection regulations. Your data is hosted in SOC 2 compliant data centers."
    },
    {
      question: "Will you offer onboarding support?",
      answer: "Yes, all plans include comprehensive onboarding support. Our customer success team will work with you to ensure a smooth implementation and help you get the most value from our platform from day one."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Everything you need to know about our platform and services.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
