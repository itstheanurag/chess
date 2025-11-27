import { motion } from "framer-motion";
import { Brain, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

const DailyPuzzle = () => {
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  return (
    <section className="relative w-full bg-background">
      <div className="px-6 py-16 md:px-12 border-b border-border/40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Brain size={16} /> Daily Challenge
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Sharpen your <br />
            <span className="text-primary">tactical vision</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Solve our daily puzzles to keep your streak alive and earn bonus
            points.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2">
            {/* Puzzle Board Visual */}
            <div className="bg-secondary/20 p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-10" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md aspect-square bg-background rounded-xl shadow-2xl border-8 border-background flex items-center justify-center"
              >
                {/* Simplified Board Representation */}
                <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                  {[...Array(64)].map((_, i) => {
                    const x = i % 8;
                    const y = Math.floor(i / 8);
                    const isBlack = (x + y) % 2 === 1;
                    return (
                      <div
                        key={i}
                        className={`${
                          isBlack ? "bg-primary/20" : "bg-secondary/10"
                        } w-full h-full`}
                      />
                    );
                  })}
                </div>

                {/* Placeholder Pieces for a "Mate in 1" scenario */}
                {/* Placeholder Pieces for a "Mate in 1" scenario */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Just some visual pieces */}
                  <div className="absolute top-[12.5%] left-[37.5%] w-[12.5%] h-[12.5%] flex items-center justify-center text-4xl">
                    ♔
                  </div>
                  <div className="absolute bottom-[12.5%] left-[37.5%] w-[12.5%] h-[12.5%] flex items-center justify-center text-4xl text-primary">
                    ♕
                  </div>
                  <div className="absolute bottom-[37.5%] right-[25%] w-[12.5%] h-[12.5%] flex items-center justify-center text-4xl text-primary">
                    ♖
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-border">
                  White to Move
                </div>
              </motion.div>
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6">
                Can you find the mate in 2?
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Difficulty:{" "}
                  <span className="text-foreground">Hard (1800+)</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Solved by:{" "}
                  <span className="text-foreground">1,243 players today</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setStatus("correct")}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex-1 md:flex-none"
                >
                  Solve Puzzle
                </button>
                <button className="px-8 py-3 rounded-xl border border-border hover:bg-secondary/50 transition-all font-semibold flex-1 md:flex-none">
                  View Solution
                </button>
              </div>

              {status === "correct" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-600"
                >
                  <CheckCircle2 size={20} />
                  <span className="font-semibold">Correct! +15 Rating</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyPuzzle;
