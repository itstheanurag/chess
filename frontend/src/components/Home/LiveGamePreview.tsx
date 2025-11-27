import { motion } from "framer-motion";
import { Play, User, Clock, Trophy } from "lucide-react";

const LiveGamePreview = () => {
  return (
    <section className="relative w-full border-b border-border/40 overflow-hidden">
      <div className="px-6 py-16 md:px-12 border-b border-border/40">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-red-500 font-bold mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE NOW
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Watch top players <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              battle in real-time
            </span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Tune in to high-stakes matches, follow your favorite grandmasters,
            and learn from their moves as they happen.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Weekly Grand Prix</h4>
                  <p className="text-sm text-muted-foreground">
                    Prize Pool: $5,000
                  </p>
                </div>
                <button className="ml-auto px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  View Bracket
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold">GM Hikaru vs GM Magnus</h4>
                  <p className="text-sm text-muted-foreground">
                    Blitz Championship • Round 4
                  </p>
                </div>
                <button className="ml-auto px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500 text-sm font-medium hover:bg-purple-500/20 transition-colors">
                  Watch
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Puzzle Rush Battle</h4>
                  <p className="text-sm text-muted-foreground">
                    IM Levy vs GM Naroditsky
                  </p>
                </div>
                <button className="ml-auto px-4 py-2 rounded-lg bg-orange-500/10 text-orange-500 text-sm font-medium hover:bg-orange-500/20 transition-colors">
                  Watch
                </button>
              </div>

              <button className="w-full py-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                View All Live Games
              </button>
            </div>
          </div>

          {/* Visual Side - Mock Game Board */}
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-30" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8 }}
              className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Game Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-sm font-medium">
                    LIVE • Blitz 3+2
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>14:20</span>
                </div>
              </div>

              {/* Board Representation (Simplified Grid) */}
              <div className="aspect-square w-full bg-[#EBECD0] relative">
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isDark = (row + col) % 2 === 1;
                    return (
                      <div
                        key={i}
                        className={`${
                          isDark ? "bg-[#779556]" : "bg-[#EBECD0]"
                        } w-full h-full`}
                      />
                    );
                  })}
                </div>

                {/* Mock Pieces (Just CSS circles/icons for now to simulate state) */}
                <motion.div
                  className="absolute top-[12.5%] left-[37.5%] w-[12.5%] h-[12.5%] flex items-center justify-center z-10"
                  initial={{ y: 0 }}
                  animate={{ y: "100%" }}
                  transition={{
                    duration: 0.5,
                    delay: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    repeatType: "reverse",
                  }}
                >
                  {/* Black Pawn */}
                  <div className="w-4/5 h-4/5 rounded-full bg-black border-2 border-white/20 shadow-lg" />
                </motion.div>

                <div className="absolute bottom-[12.5%] left-[50%] w-[12.5%] h-[12.5%] flex items-center justify-center z-10">
                  {/* White King */}
                  <div className="w-4/5 h-4/5 rounded-full bg-white border-2 border-black/10 shadow-lg flex items-center justify-center text-black font-serif font-bold text-xl">
                    K
                  </div>
                </div>
              </div>

              {/* Game Footer */}
              <div className="p-4 bg-card border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div>
                    <p className="text-sm font-bold">Magnus Carlsen</p>
                    <p className="text-xs text-muted-foreground">2882</p>
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold">1:45</div>
              </div>
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-card border border-border shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Engine Eval
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-foreground">+1.4</span>
                <span className="text-sm text-green-500 font-medium mb-1">
                  White is winning
                </span>
              </div>
              <div className="w-32 h-1 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="w-[65%] h-full bg-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveGamePreview;
