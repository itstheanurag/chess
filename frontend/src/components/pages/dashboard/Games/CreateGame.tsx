import { useState, useEffect } from "react";
import CreateGameModal from "./Modal";
import { Plus } from "lucide-react";

const CreatGame = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium"
      >
        <Plus size={20} />
        New Game
      </button>

      {open && <CreateGameModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default CreatGame;
