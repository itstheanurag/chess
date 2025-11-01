"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") ?? "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        fixed top-2 left-0 right-0 z-50
        backdrop-blur-lg
        bg-background/80
        border border-border
        rounded-xl
        mx-auto max-w-6xl px-4 py-3
      "
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold text-foreground">ChessApp</div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="
              p-2 rounded-md
              border border-border
              bg-secondary
              hover:bg-accent
              transition
            "
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Get Started */}
          <a
            href="/play"
            className="
              px-4 py-2 rounded-md font-medium
              bg-primary text-primary-foreground
              hover:bg-primary/80
              transition
            "
          >
            Get Started
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
