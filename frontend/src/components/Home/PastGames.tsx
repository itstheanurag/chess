import React from "react";

interface Winner {
  name: string;
  date: string;
  score: string;
}

const winners: Winner[] = [
  { name: "Alice Johnson", date: "Sep 10, 2025", score: "1-0" },
  { name: "Bob Smith", date: "Sep 12, 2025", score: "0-1" },
  { name: "Carol Lee", date: "Sep 14, 2025", score: "1-0" },
  { name: "David Kim", date: "Sep 16, 2025", score: "1-0" },
];

const PastGames: React.FC = () => {
  return (
    <section className="relative w-full py-20 bg-neutral-50 text-neutral-400 ">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-neutral-800">
          Past Winners
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-neutral-700 transition-colors shadow-lg"
            >
              {/* Winner Avatar */}
              <div className="w-16 h-16 bg-neutral-600 rounded-full mb-4 flex items-center justify-center text-xl font-bold text-white">
                {winner.name.charAt(0)}
              </div>

              {/* Winner Info */}
              <h3 className="text-lg font-semibold mb-1">{winner.name}</h3>
              <p className="text-neutral-400 text-sm mb-2">{winner.date}</p>
              <span className="bg-neutral-700 text-neutral-200 px-3 py-1 rounded-full text-sm font-medium">
                {winner.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastGames;
