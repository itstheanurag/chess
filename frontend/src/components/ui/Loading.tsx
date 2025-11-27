import { motion } from "framer-motion";
import Logo from "./Logo";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Logo className="w-16 h-16 relative z-10" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-muted-foreground font-medium animate-pulse"
      >
        Loading ChessMaster...
      </motion.p>
    </div>
  );
};

export default Loading;
