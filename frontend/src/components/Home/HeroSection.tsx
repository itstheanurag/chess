import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-neutral-900 text-white">
      {/* Animated chessboard background */}
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

      {/* Gradient overlay to lighten the top */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 via-neutral-900/30 to-neutral-900/70"></div>

      {/* Foreground content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Play Chess Online
        </h1>
        <p className="text-neutral-300 mb-6 max-w-xl mx-auto">
          Challenge friends or train against the computer. Smooth, elegant
          gameplay anytime.
        </p>
        <button
          onClick={() => console.log("Button Clicked")}
          className="px-6 py-3 bg-white text-neutral-900 rounded-2xl font-semibold hover:bg-neutral-200 transition-colors"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
