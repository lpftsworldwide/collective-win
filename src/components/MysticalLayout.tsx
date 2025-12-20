import { ReactNode } from "react";

interface MysticalLayoutProps {
  children: ReactNode;
}

export const MysticalLayout = ({ children }: MysticalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative hieroglyph-bg tarot-bg">
      {/* Ancient Tarot & Mystical background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(270_50%_15%/0.5),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(45_85%_20%/0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,hsl(230_30%_2%)_100%)]" />
        
        {/* Ancient scriptures and tarot symbols */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-premium-gold/8 text-3xl md:text-4xl animate-hieroglyph"
            style={{
              left: `${(i * 5) + 2}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${i * 0.3}s`,
              fontFamily: 'serif',
            }}
          >
            {['⚡', '🃏', '🃎', '🃍', '⭐', '🔮', '👁', '⚰', '⚱', '☥', '𓂀', '𓃭', '𓆣', '𓇳', '𓊹', '𓋹', '𓏏', '𓂋', '∞', '☯'][i % 20]}
          </div>
        ))}
        
        {/* Tarot card outlines floating */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`tarot-${i}`}
            className="absolute border border-premium-gold/5 rounded-lg animate-float"
            style={{
              width: '120px',
              height: '180px',
              left: `${(i * 12) + 5}%`,
              top: `${Math.random() * 70 + 10}%`,
              animationDelay: `${i * 0.8}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

