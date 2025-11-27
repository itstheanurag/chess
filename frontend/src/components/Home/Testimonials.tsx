import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Novak",
    role: "Grandmaster",
    content:
      "The analysis tools on ChessMaster are second to none. It's become an essential part of my daily training routine.",
    avatar: "https://i.pravatar.cc/150?u=alex",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Club Player",
    content:
      "I've improved my rating by 400 points in just 3 months. The puzzles and lessons are incredibly effective.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Chess Coach",
    content:
      "I recommend this platform to all my students. The interface is intuitive and the community is very supportive.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    rating: 5,
  },
];

const Testimonials = () => {
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
            Loved by <br />
            <span className="text-primary">players worldwide</span>
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Join a community of passionate chess enthusiasts who are elevating
            their game every day.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border/50 p-8 rounded-3xl relative hover:border-primary/30 transition-colors group"
            >
              <Quote className="absolute top-8 right-8 text-primary/10 w-10 h-10 group-hover:text-primary/20 transition-colors" />

              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              <p className="text-lg mb-8 text-muted-foreground leading-relaxed">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-background"
                />
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-primary">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
