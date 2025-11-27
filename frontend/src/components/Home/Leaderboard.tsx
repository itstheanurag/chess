import { motion } from "framer-motion";
import { Trophy, ArrowUpRight, Crown } from "lucide-react";

const players = [
  { rank: 1, name: "Magnus C.", rating: 2882, country: "NO", change: "+12" },
  { rank: 2, name: "Hikaru N.", rating: 2811, country: "US", change: "+8" },
  { rank: 3, name: "Fabiano C.", rating: 2803, country: "US", change: "-3" },
  { rank: 4, name: "Ding L.", rating: 2762, country: "CN", change: "+5" },
  { rank: 5, name: "Alireza F.", rating: 2759, country: "FR", change: "+15" },
];

const Leaderboard = () => {
  return (
    <section className="relative w-full bg-secondary/5 border-y border-border/40">
      <div className="px-6 py-16 md:px-12 border-b border-border/40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-6">
            <Trophy size={16} /> Global Rankings
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Compete with <br />
            <span className="text-primary">the best players</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Climb the global leaderboards and prove your mastery.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col items-center gap-12">
          {/* Leaderboard Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-border bg-secondary/10 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Crown size={20} className="text-yellow-500" /> Top Players
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-background rounded border border-border">
                  Live Updates
                </span>
              </div>
              <div className="divide-y divide-border/50">
                {players.map((player) => (
                  <div
                    key={player.rank}
                    className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                          player.rank === 1
                            ? "bg-yellow-500/20 text-yellow-600"
                            : player.rank === 2
                            ? "bg-gray-300/20 text-gray-600"
                            : player.rank === 3
                            ? "bg-orange-700/20 text-orange-700"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {player.rank}
                      </span>
                      <div>
                        <p className="font-semibold group-hover:text-primary transition-colors">
                          {player.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {player.country}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold">{player.rating}</p>
                      <p
                        className={`text-xs ${
                          player.change.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {player.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <button className="px-8 py-4 rounded-full bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-all font-semibold flex items-center gap-2 group">
            View Full Standings
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
