import React from "react";
import { motion } from "framer-motion";
import Navbar from "../ui/Navbar";
import Features from "./Features";
import HeroSection from "./HeroSection";
import FAQ from "./FAQ";
import LiveGamePreview from "./LiveGamePreview";
import HowItWorks from "./HowItWorks";
import Leaderboard from "./Leaderboard";
import DailyPuzzle from "./DailyPuzzle";
import Testimonials from "./Testimonials";
import Footer from "../ui/Footer";
import { Link } from "react-router-dom";

const SlashSeparator = () => (
  <div className="w-full h-12 border-y border-border/40 relative overflow-hidden text-muted-foreground/20">
    <div className="absolute inset-0 bg-[length:10px_10px] bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]" />
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <Navbar />

      <main className="flex flex-col">
        {/* Hero Section - Full Width Background, Content Constrained */}
        <HeroSection />

        {/* Main Content Container */}
        <div className="w-full max-w-7xl mx-auto border-x border-border/40 bg-background/50 backdrop-blur-sm">
          {/* Features Section */}
          <Features />

          {/* Separator */}
          <SlashSeparator />

          {/* How It Works */}
          <HowItWorks />

          <SlashSeparator />

          {/* Live Game Preview Section */}
          <LiveGamePreview />

          {/* Leaderboard Section */}
          <Leaderboard />

          {/* Daily Puzzle Section */}
          <DailyPuzzle />

          <SlashSeparator />

          {/* Testimonials */}
          <Testimonials />

          {/* CTA Section */}
          <section className="py-32 relative overflow-hidden border-b border-border/40">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/10 blur-[120px] rounded-full -z-10" />

            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-card border border-border rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden"
              >
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <h2 className="text-4xl md:text-6xl font-bold mb-6 relative z-10">
                  Ready to make your move?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
                  Join a community of passionate players and take your chess
                  game to the next level today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                  <Link to="/register">
                    <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 w-full sm:w-auto">
                      Get Started for Free
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="px-8 py-4 rounded-full border border-border bg-background hover:bg-accent text-foreground font-bold text-lg transition-all w-full sm:w-auto">
                      Log In
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <SlashSeparator />

          {/* FAQ Section */}
          <FAQ />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
