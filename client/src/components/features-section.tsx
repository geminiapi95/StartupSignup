import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: "ri-speed-up-line",
      title: "Enhanced Productivity",
      description: "Streamline workflows and automate repetitive tasks to boost your team's efficiency by up to 40%."
    },
    {
      icon: "ri-bubble-chart-line",
      title: "Data-Driven Insights",
      description: "Leverage advanced analytics to make informed decisions and identify growth opportunities."
    },
    {
      icon: "ri-secure-payment-line",
      title: "Enterprise Security",
      description: "Rest easy with our bank-level encryption and comprehensive security protocols."
    }
  ];

  const integrationFeatures = [
    "Connect with 200+ popular business applications",
    "Simple API for custom integrations",
    "Automated data synchronization",
    "No-code workflow automation"
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Why Choose Innovate?</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with intuitive design to deliver unparalleled results for businesses of all sizes.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background p-6 rounded-xl hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary mb-4">
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-heading font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 bg-background rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold">Seamless Integration</h3>
              <p className="mt-4 text-muted-foreground">
                Our platform integrates with your existing tools and workflows, creating a unified ecosystem that eliminates silos and enhances collaboration.
              </p>
              <ul className="mt-6 space-y-3">
                {integrationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <i className="ri-checkbox-circle-fill text-secondary-500 mr-2"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                alt="Technology integration visualization" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
