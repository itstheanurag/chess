import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is ChessMaster completely free to use?",
    answer:
      "Yes! You can play unlimited games, join tournaments, and access basic analysis for free. We also offer a Premium tier for advanced engine insights, unlimited puzzles, and exclusive video content.",
  },
  {
    question: "How does the global matchmaking work?",
    answer:
      "Our matchmaking system uses the Glicko-2 rating system to pair you with players of similar skill levels. You can choose from various time controls including Bullet, Blitz, Rapid, and Classical.",
  },
  {
    question: "Can I analyze my games after playing?",
    answer:
      "Absolutely. Every game is automatically saved to your archive. You can analyze it immediately using the latest Stockfish engine to identify mistakes, blunders, and missed opportunities.",
  },
  {
    question: "Do you host official tournaments?",
    answer:
      "We host daily, weekly, and monthly tournaments with various prize pools. Some tournaments are open to all, while others may require a specific rating or Premium membership.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "We are currently developing our dedicated mobile apps for iOS and Android. In the meantime, our website is fully responsive and works perfectly on all mobile browsers.",
  },
  {
    question: "How can I improve my rating?",
    answer:
      "Consistency is key. We recommend solving daily puzzles, analyzing your lost games, and watching our educational content from Grandmasters. Our 'Learn' section offers structured courses for all levels.",
  },
];

const FAQItem = ({
  item,
  index,
}: {
  item: (typeof faqs)[0];
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium group-hover:text-primary transition-colors">
          {item.question}
        </span>
        <span
          className={`
          ml-4 p-2 rounded-full border border-border/50 
          group-hover:border-primary/50 group-hover:bg-primary/5 transition-all
          ${
            isOpen
              ? "rotate-45 bg-primary/10 border-primary/50 text-primary"
              : "text-muted-foreground"
          }
        `}
        >
          <Plus size={16} />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed max-w-2xl">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="px-6 py-16 md:px-12 border-b border-border/40">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Frequently asked <br />
            <span className="text-primary">questions</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the platform and how to get
            started.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-3xl p-8 md:p-12">
          {faqs.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
