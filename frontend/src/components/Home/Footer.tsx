import React from "react";
import { FaGithub, FaChessKnight } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full relative bg-neutral-900 text-neutral-300">
      {/* Content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-wide pt-10">
          <FaChessKnight className="text-white text-2xl" />
          <span className="text-white">ChessHub</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 pt-10">
          <a
            href="https://github.com/itstheanurag/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <FaGithub className="text-xl" />
            GitHub
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-sm text-neutral-500 mb-6">
        &copy; {new Date().getFullYear()} ChessHub • Built with ❤️ by{" "}
        <a
          href="https://github.com/itstheanurag/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Anurag
        </a>
      </div>
    </footer>
  );
};

export default Footer;
