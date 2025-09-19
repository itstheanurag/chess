import React from "react";

interface OngoingGame {
  player1: string;
  player2: string;
  score: string;
  timeLeft: string;
}

const ongoingGames: OngoingGame[] = [
  {
    player1: "Alice Johnson",
    player2: "Bob Smith",
    score: "0.5 - 0.5",
    timeLeft: "12:34",
  },
  {
    player1: "Carol Lee",
    player2: "David Kim",
    score: "1 - 0",
    timeLeft: "05:20",
  },
  {
    player1: "Eve Martinez",
    player2: "Frank Li",
    score: "0 - 1",
    timeLeft: "09:10",
  },
  {
    player1: "Grace Wong",
    player2: "Hector Cruz",
    score: "0 - 0",
    timeLeft: "14:45",
  },
];

const OngoingGames: React.FC = () => {
  return (
    <section className="relative w-full py-20 bg-neutral-50 text-neutral-400 ">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-neutral-800">
          Ongoing Games
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ongoingGames.map((game, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-neutral-700 transition-colors shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-2">
                {game.player1} vs {game.player2}
              </h3>
              <p className="text-neutral-400 mb-2">Score: {game.score}</p>
              <span className="bg-neutral-700 text-neutral-200 px-3 py-1 rounded-full text-sm font-medium">
                Time Left: {game.timeLeft}
              </span>
              <p className="mt-2 text-green-400 font-semibold text-sm">
                In Progress
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OngoingGames;
