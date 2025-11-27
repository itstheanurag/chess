"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") ?? "light";
    }
    return "light";
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navLinks = [
    { name: "Play", path: "/play" },
    { name: "Puzzles", path: "/puzzles" },
    { name: "Learn", path: "/learn" },
    { name: "Watch", path: "/watch" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-6 left-0 right-0 z-50 mx-auto max-w-7xl px-4"
    >
      <div
        className="
        relative backdrop-blur-xl bg-background/60 border border-white/10 shadow-2xl shadow-black/5
        rounded-md px-6 py-3 flex justify-between items-center
      "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Logo className="w-10 h-10 relative z-10" />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 bg-secondary/5 rounded-full p-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-5 py-2 text-sm font-medium transition-colors hover:text-primary"
            >
              {hoveredLink === link.name && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-background rounded-full shadow-sm border border-black/5 dark:border-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="
              p-2.5 rounded-full
              bg-secondary/10 hover:bg-secondary/20
              transition-colors
              text-muted-foreground hover:text-foreground
            "
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Get Started Button */}
          <Link
            to="/login"
            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
          >
            <span>Get Started</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full left-4 right-4 mt-4 p-6 rounded-3xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl md:hidden flex flex-col gap-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium p-4 hover:bg-secondary/10 rounded-2xl transition-colors flex items-center justify-between group"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                />
              </Link>
            ))}
            <div className="h-px bg-border my-4" />
            <Link
              to="/login"
              className="w-full py-4 rounded-xl font-bold text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
