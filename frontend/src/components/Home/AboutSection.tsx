import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center w-full py-20 text-neutral-800 bg-neutral-100">
      {/* Subtle animated background */}
      {/* Content */}
      <div className="relative z-10 max-w-3xl px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          About Our Chess App
        </h2>
        <p className="text-neutral-600 mb-4">
          Our platform is built for players of every skill level. Whether you're
          a beginner learning your first moves or a seasoned grandmaster seeking
          challenging opponents, our chess app provides an elegant and
          responsive interface to enjoy the game you love.
        </p>
        <p className="text-neutral-600">
          Play against friends, join tournaments, or refine your strategy with
          our built-in training tools. The clean design and smooth animations
          keep the focus where it matters—on the board.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
