import { motion } from "framer-motion";
import {
  Cpu,
  Globe,
  Puzzle,
  Trophy,
  Video,
  BarChart3,
  Plus,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Analysis",
    description:
      "Analyze your games with the latest Stockfish engine to find your mistakes.",
    color: "text-blue-500",
    id: "ai",
  },
  {
    icon: Globe,
    title: "Global Matchmaking",
    description: "Play against millions of players worldwide in seconds.",
    color: "text-green-500",
    id: "global",
  },
  {
    icon: Puzzle,
    title: "Tactical Puzzles",
    description: "Solve thousands of puzzles to sharpen your tactical vision.",
    color: "text-purple-500",
    id: "puzzles",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Join daily tournaments, compete for prizes, and earn badges.",
    color: "text-yellow-500",
    id: "tournaments",
  },
  {
    icon: Video,
    title: "Learn from Masters",
    description: "Watch exclusive video lessons from Grandmasters.",
    color: "text-red-500",
    id: "learn",
  },
  {
    icon: BarChart3,
    title: "Advanced Stats",
    description: "Track your progress with detailed analytics and insights.",
    color: "text-cyan-500",
    id: "stats",
  },
];

const FeatureVisual = ({ id }: { id: string }) => {
  switch (id) {
    case "ai":
      return (
        <div className="h-24 w-full relative overflow-hidden rounded-lg bg-blue-500/5 border border-blue-500/10 p-2 flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(59,130,246,0.1),transparent)] -translate-x-full animate-[shimmer_2s_infinite]" />
          <div className="flex gap-1 items-end h-12">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: "20%" }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1,
                }}
                className="w-2 bg-blue-500/40 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      );
    case "global":
      return (
        <div className="h-24 w-full relative overflow-hidden rounded-lg bg-green-500/5 border border-green-500/10 flex items-center justify-center">
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-green-500/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border border-green-500/30 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 rounded-full"
            />
          </div>
        </div>
      );
    case "puzzles":
      return (
        <div className="h-24 w-full relative overflow-hidden rounded-lg bg-purple-500/5 border border-purple-500/10 p-4 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="rounded-sm bg-purple-500/30"
            />
          ))}
        </div>
      );
    case "tournaments":
      return (
        <div className="h-24 w-full relative overflow-hidden rounded-lg bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Trophy size={32} className="text-yellow-500/50" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
            />
          </motion.div>
          <div className="absolute bottom-2 w-3/4 h-1 bg-yellow-500/20 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-yellow-500/50"
            />
          </div>
        </div>
      );
    case "learn":
      return (
        <div className="h-24 w-full relative overflow-hidden rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
          <div className="w-12 h-8 rounded border border-red-500/30 flex items-center justify-center relative bg-background/50">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-red-500 border-b-[4px] border-b-transparent ml-1"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 space-y-1">
            <div className="h-1 bg-red-500/10 rounded-full w-full" />
            <div className="h-1 bg-red-500/10 rounded-full w-2/3" />
          </div>
        </div>
      );
    case "stats":
      return (
        <div className="h-24 w-full relative overflow-hidden rounded-lg bg-cyan-500/5 border border-cyan-500/10 p-3 flex items-end gap-1">
          {[30, 50, 40, 70, 50, 80, 60, 90].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="flex-1 bg-cyan-500/30 rounded-t-sm hover:bg-cyan-500/50 transition-colors"
            />
          ))}
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            <svg className="w-full h-full overflow-visible">
              <motion.path
                d="M 10 70 Q 40 60 70 40 T 130 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cyan-500/50"
              />
            </svg>
          </motion.div>
        </div>
      );
    default:
      return null;
  }
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <div className="relative border-r border-b border-border/40 group">
      {/* Intersection Plus */}

      <div
        className="
        relative p-8 h-full
        bg-background/20 backdrop-blur-sm
        hover:bg-background/40 transition-colors duration-300
        overflow-hidden
        flex flex-col justify-between gap-6
      "
      >
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex items-start gap-4">
          <div
            className="
          p-3 rounded-xl bg-background/50 border border-border/50
          shadow-sm group-hover:scale-110 transition-transform duration-300
        "
          >
            <feature.icon size={24} className={feature.color} />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>

        {/* Dynamic Visual Animation */}
        <div className="mt-auto pt-4">
          <FeatureVisual id={feature.id} />
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="relative w-full">
      {/* Section Header */}
      <div className="px-6 py-16 md:px-12 border-b border-border/40">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Everything you need to <br />
            <span className="text-primary">become a master</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools designed for every stage of your journey.
          </p>
        </div>
      </div>

      {/* Collapsed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-border/40">
        {features.map((feature, i) => (
          <FeatureCard key={i} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Features;
