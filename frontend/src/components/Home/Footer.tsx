import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="p-4 bg-gray-800 text-white text-center text-sm w-full">
      <p>&copy; {new Date().getFullYear()} ChessHub • Built with ❤️</p>
      <p>
        <a
          href="https://github.com/itstheanurag/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
