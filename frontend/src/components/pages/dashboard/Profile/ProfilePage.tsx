import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { callGetAllGameStatsApi } from "@/utils/apis/games";
import { Stats } from "@/types";
import { motion } from "framer-motion";
import {
  Trophy,
  Swords,
  Shield,
  Minus,
  Calendar,
  Mail,
  User as UserIcon,
  Palette,
  Gamepad2,
  Volume2,
  Check,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const ProfilePage: React.FC = () => {
  const { authUser } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Settings states
  const { setTheme, theme } = useTheme();
  const [boardTheme, setBoardTheme] = useState("green");
  const [pieceSet, setPieceSet] = useState("neo");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [premoves, setPremoves] = useState(true);
  const [autoQueen, setAutoQueen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await callGetAllGameStatsApi();
        if (data && data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      label: "Total Games",
      value: stats?.total || 0,
      icon: Swords,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Wins",
      value: stats?.wins || 0,
      icon: Trophy,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Losses",
      value: stats?.losses || 0,
      icon: Shield,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Draws",
      value: stats?.draws || 0,
      icon: Minus,
      color: "text-gray-500",
      bg: "bg-gray-500/10",
    },
  ];

  const boardThemes = [
    { id: "green", name: "Classic Green", color: "bg-[#769656]" },
    { id: "blue", name: "Ocean Blue", color: "bg-[#4b7399]" },
    { id: "brown", name: "Wood", color: "bg-[#b58863]" },
    { id: "purple", name: "Royal Purple", color: "bg-[#8b5cf6]" },
  ];

  const pieceSets = [
    { id: "neo", name: "Neo" },
    { id: "wood", name: "Wood" },
    { id: "alpha", name: "Alpha" },
    { id: "modern", name: "Modern" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: UserIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "gameplay", label: "Gameplay", icon: Gamepad2 },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />

        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-purple-600">
                  {authUser?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-background rounded-full" />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {authUser?.username || "User"}
              </h1>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {authUser?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Rating: 1200
              </div>
              <div className="px-4 py-1.5 rounded-full bg-secondary text-muted-foreground font-medium text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5 text-primary" />
                Game Statistics
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-colors shadow-sm"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">
                          {card.label}
                        </p>
                        <p className="text-2xl font-bold tracking-tight">
                          {loading ? (
                            <span className="animate-pulse bg-secondary h-8 w-16 rounded block" />
                          ) : (
                            card.value
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="rounded-2xl bg-card border border-border/50 p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                  Your recent game history and analysis will appear here. Start
                  playing to build your history!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-8">
            {/* App Theme */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">App Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as any)}
                      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        theme === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Board Theme */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Board Theme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {boardThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setBoardTheme(theme.id)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      boardTheme === theme.id
                        ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <div className={`absolute inset-0 ${theme.color}`} />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10" />
                    <div className="absolute bottom-3 left-3 text-white font-medium drop-shadow-md">
                      {theme.name}
                    </div>
                    {boardTheme === theme.id && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Piece Set */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Piece Set</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {pieceSets.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => setPieceSet(set.id)}
                    className={`flex items-center justify-center p-6 rounded-xl border-2 transition-all ${
                      pieceSet === set.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  >
                    <span className="font-medium">{set.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "gameplay" && (
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Game Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Enable Pre-moves</div>
                      <div className="text-sm text-muted-foreground">
                        Allow making moves on opponent's time
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={premoves}
                    onChange={(e) => setPremoves(e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Sound Effects</div>
                      <div className="text-sm text-muted-foreground">
                        Play sounds for moves and captures
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Auto-Queen</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically promote pawns to Queen
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoQueen}
                    onChange={(e) => setAutoQueen(e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                </label>
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">Security Settings</h3>
            <p>Security and account management features coming soon.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
