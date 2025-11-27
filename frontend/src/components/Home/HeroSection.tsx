import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div>
      {" "}
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-background">
        <div className="relative p-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Master the Game of Kings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mt-6"
          >
            Play chess online, challenge friends, and improve your skills with
            our intuitive platform.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.6,
              type: "spring",
              stiffness: 150,
            }}
            className="
              mt-8 px-8 py-3 rounded-full text-lg font-semibold shadow-md
              bg-primary text-primary-foreground
              hover:bg-primary/80 transition-transform
              flex items-center justify-center mx-auto hover:scale-105
            "
          >
            Start Playing Now <ChevronRight className="ml-2" size={20} />
          </motion.button>
        </div>
      </section>
      {/* Sub Hero */}
      <section className="py-20 bg-secondary/30 text-center">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Your Ultimate Chess Companion
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Whether you're a beginner or a grandmaster, our platform offers
            tools and features to enhance your chess journey.
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
