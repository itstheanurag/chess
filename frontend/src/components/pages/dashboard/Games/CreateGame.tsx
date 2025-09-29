import { useState, useEffect } from "react";
import CreateGameModal from "./Modal";

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
        className="bg-neutral-800 text-neutral-50 px-4 py-2 rounded-lg hover:bg-neutral-900"
      >
        + New Game
      </button>

      {open && <CreateGameModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default CreatGame;
