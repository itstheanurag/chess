import React from "react";
import { FaChess, FaUsers, FaTrophy, FaLaptopCode } from "react-icons/fa";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <FaChess className="text-4xl text-white" />,
    title: "Play Online",
    description:
      "Challenge friends or random opponents in real-time chess matches.",
  },
  {
    icon: <FaUsers className="text-4xl text-white" />,
    title: "Community",
    description:
      "Join a community of chess enthusiasts and share your progress.",
  },
  {
    icon: <FaTrophy className="text-4xl text-white" />,
    title: "Tournaments",
    description:
      "Participate in exciting tournaments and compete for top ranks.",
  },
  {
    icon: <FaLaptopCode className="text-4xl text-white" />,
    title: "Training",
    description:
      "Improve your skills with puzzles, lessons, and practice games.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative w-full py-20 bg-neutral-100 text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800    ">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center hover:text-neutral-100 hover:bg-neutral-700 transition-colors shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
