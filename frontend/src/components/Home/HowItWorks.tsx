import { motion } from "framer-motion";
import { UserPlus, Swords, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description: "Sign up in seconds and customize your player profile.",
  },
  {
    icon: Swords,
    title: "Play & Compete",
    description: "Challenge players worldwide or play against our AI engines.",
  },
  {
    icon: TrendingUp,
    title: "Analyze & Improve",
    description: "Review your games with Stockfish and track your progress.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full">
      <div className="px-6 py-16 md:px-12 border-b border-border/40">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Your journey to <br />
            <span className="text-primary">mastery begins here</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Start your chess career in three simple steps.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center mb-8 relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform" />
                <step.icon size={32} className="text-primary relative z-10" />
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
