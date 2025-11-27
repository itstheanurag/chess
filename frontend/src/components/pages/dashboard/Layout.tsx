import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import { useUIStore } from "@/stores";
import Sidebar from "./SideBar";
import { Menu, Bell, Search } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -10 },
};

const DashboardLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { activeSection, collapsed } = useUIStore();
  const location = useLocation();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          collapsed ? "lg:ml-20" : "lg:ml-80"
        } h-screen`}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 w-full bg-background/60 backdrop-blur-xl border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDrawer}
              className="lg:hidden p-2 rounded-xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold capitalize tracking-tight">
                {activeSection}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Welcome back, Grandmaster
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 text-sm text-muted-foreground w-64">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search games, players..."
                className="bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/50"
              />
            </div>

            <button className="p-2.5 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
