import { motion } from "framer-motion";

export function AboutSection() {
  const stats = [
    { value: "30+", label: "Team Members" },
    { value: "5M+", label: "Data Points" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <section id="about" className="py-20 bg-circuit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative order-2 md:order-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Professional business team collaborating" 
              className="rounded-2xl shadow-xl w-full h-auto"
            />
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <i className="ri-customer-service-2-line text-2xl text-primary"></i>
                <div className="ml-3">
                  <p className="text-foreground font-semibold">24/7 Support</p>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">About Our Company</h2>
            <p className="mt-6 text-muted-foreground">
              Founded in 2022, Innovate was born from a simple observation: businesses spend too much time managing tools instead of focusing on growth. Our mission is to simplify the digital landscape for businesses through intelligent automation and integration.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our team of industry veterans combines decades of experience in SaaS, artificial intelligence, and business transformation to create solutions that genuinely impact your bottom line.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
