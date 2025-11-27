import { motion } from "framer-motion";
import { CheckCircle, Star, Award } from "lucide-react";
const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Key Features
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[CheckCircle, Star, Award, CheckCircle, Star, Award].map(
            (Icon, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="
                    p-8 rounded-xl shadow-sm border
                    bg-card border-border
                    hover:shadow-md transition-shadow text-center
                  "
              >
                <Icon size={48} className="mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-semibold mb-3">Feature {i + 1}</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;
