import { createContext, useContext, useEffect, useMemo } from "react";
import { connectSockets } from "@/sockets";

const SocketContext = createContext<ReturnType<typeof connectSockets> | null>(
  null
);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sockets = useMemo(() => connectSockets("your-auth-token"), []);

  useEffect(() => {
    return () => {
      sockets.game.disconnect();
      sockets.chat.disconnect();
    };
  }, [sockets]);

  return (
    <SocketContext.Provider value={sockets}>{children}</SocketContext.Provider>
  );
};

export const useSockets = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSockets must be used within a SocketProvider");
  return ctx;
};
