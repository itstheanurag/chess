import React from "react";
import { motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import { ChevronRight, CheckCircle, Star, Award } from "lucide-react";
import Features from "./Features";
import HeroSection from "./HeroSection";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <HeroSection />
      {/* Features */}
      <Features />
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
