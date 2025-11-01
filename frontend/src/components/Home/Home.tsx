import React from "react";
import { motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import { ChevronRight, CheckCircle, Star, Award } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

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

      {/* Features */}
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
                  <h3 className="text-2xl font-semibold mb-3">
                    Feature {i + 1}
                  </h3>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 border rounded-xl bg-card border-border"
              >
                <h3 className="text-xl font-semibold mb-2">Question {i}?</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border text-center">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} ChessApp. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
