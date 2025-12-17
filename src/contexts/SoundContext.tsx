import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("sound-muted");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sound-muted", String(isMuted));
  }, [isMuted]);

  const toggleMute = () => setIsMuted((prev) => !prev);
  const setMuted = (muted: boolean) => setIsMuted(muted);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, setMuted }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
