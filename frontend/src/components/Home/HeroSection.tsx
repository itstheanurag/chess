import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-neutral-900 text-white">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className={`w-full h-full ${
              (Math.floor(i / 8) + i) % 2 === 0
                ? "bg-neutral-800"
                : "bg-neutral-700"
            } animate-pulse`}
            style={{
              animationDelay: `${i * 50}ms`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 via-neutral-900/30 to-neutral-900/70"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Play Chess Online
        </h1>
        <p className="text-neutral-300 mb-6 max-w-xl mx-auto">
          Challenge friends or train against the computer. Smooth, elegant
          gameplay anytime.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 bg-white text-neutral-900 rounded-2xl font-semibold hover:bg-neutral-200 transition-colors"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
