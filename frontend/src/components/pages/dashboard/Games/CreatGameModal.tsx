import { useEffect, useState } from "react";
import CreateGameForm from "./CreateGame";

const CreateGameModal = () => {
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

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Create Game</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <CreateGameForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateGameModal;
