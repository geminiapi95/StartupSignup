import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Innovate has transformed how we manage our projects. Our team productivity has increased by 35% in just three months.",
      author: "Sarah Miller",
      role: "CTO, TechVision Inc.",
      initials: "SM"
    },
    {
      quote: "The insights we've gained from the analytics dashboard alone have helped us identify key growth opportunities we were missing.",
      author: "James Thompson",
      role: "CEO, Growth Partners",
      initials: "JT"
    },
    {
      quote: "As a startup, we needed a solution that could scale with us. Innovate not only met but exceeded our expectations in every way.",
      author: "Amy Liu",
      role: "Founder, NexGen Solutions",
      initials: "AL"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">What Our Early Users Say</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover how Innovate is transforming businesses across industries.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 text-yellow-400">
                    {Array(5).fill(0).map((_, i) => (
                      <i key={i} className="ri-star-fill"></i>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center">
                    <Avatar>
                      <AvatarFallback className="bg-gray-300 text-white text-xs">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-semibold">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
