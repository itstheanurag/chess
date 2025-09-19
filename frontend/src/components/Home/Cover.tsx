import React from "react";

const Cover: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen bg-neutral-900 text-white overflow-hidden rounded-2xl">
      {/* Animated chessboard background */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
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

      {/* Foreground content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-wider mb-6">
          CHESS <span className="text-neutral-400">MASTER</span>
        </h1>
        <p className="text-neutral-300 max-w-2xl mx-auto mb-8">
          A sleek and powerful platform to play, learn, and master chess.
          Challenge friends, sharpen your skills, and climb the leaderboard.
        </p>
        <button className="px-8 py-3 bg-white text-neutral-900 font-semibold rounded-2xl hover:bg-neutral-200 transition-colors">
          Play Now
        </button>
      </div>
    </section>
  );
};

export default Cover;
