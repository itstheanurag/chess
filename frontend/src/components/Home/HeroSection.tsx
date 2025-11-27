import { motion } from "framer-motion";
import { ChevronRight, Play, Trophy, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/40">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/chess-bg-floating.png"
          alt="Chess Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-md text-sm font-medium text-muted-foreground mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            10,432 Players Online Now
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-600 animate-gradient-x">
              Strategic Mastery
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Elevate your game with AI-powered analysis, global tournaments, and
            a stunning 3D interface designed for the modern grandmaster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/dashboard">
              <button className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:shadow-[0_0_60px_-15px_rgba(var(--primary),0.6)] hover:scale-105 flex items-center gap-2">
                Play Now <ChevronRight size={20} />
              </button>
            </Link>
            <Link to="/watch">
              <button className="h-14 px-8 rounded-full border border-border/50 bg-background/30 backdrop-blur-md text-foreground font-bold text-lg hover:bg-secondary/50 transition-all hover:scale-105 flex items-center gap-2">
                <Play size={20} className="fill-current" /> Watch Live
              </button>
            </Link>
          </div>

          {/* Stats / Social Proof */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-border/20 mt-12">
            <div className="text-center">
              <div className="flex justify-center mb-2 text-primary">
                <Users size={24} />
              </div>
              <div className="text-2xl font-bold">1M+</div>
              <div className="text-sm text-muted-foreground">
                Registered Users
              </div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 text-purple-500">
                <Zap size={24} />
              </div>
              <div className="text-2xl font-bold">50M+</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2 text-yellow-500">
                <Trophy size={24} />
              </div>
              <div className="text-2xl font-bold">$100k</div>
              <div className="text-sm text-muted-foreground">Prize Pool</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
