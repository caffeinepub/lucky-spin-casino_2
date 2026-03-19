import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";

interface GameLayoutProps {
  children: ReactNode;
  title: string;
  emoji: string;
  accentColor: string;
}

export default function GameLayout({
  children,
  title,
  emoji,
  accentColor,
}: GameLayoutProps) {
  const { balance, isRegistered, setShowRegisterModal } = useUser();

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)" }}
    >
      <div
        className="sticky top-16 z-40 border-b"
        style={{ background: "#0d0d0d", borderColor: accentColor }}
      >
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link
            to="/games"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            data-ocid="game.back.link"
          >
            <ArrowLeft className="w-4 h-4" /> All Games
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span
              className="font-black text-sm uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              {title}
            </span>
          </div>
          <div
            className="flex items-center gap-2 bg-black rounded-full px-3 py-1 border"
            style={{ borderColor: accentColor }}
          >
            <span className="text-sm">🪙</span>
            <span className="text-sm font-bold" style={{ color: accentColor }}>
              {Number(balance).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!isRegistered && (
          <div
            className="text-center mb-6 p-4 rounded-xl border"
            style={{ background: "#1a1a0a", borderColor: accentColor }}
          >
            <p className="text-white font-bold">
              ⚠️ Register to save your progress and winnings!
            </p>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="mt-2 px-4 py-2 rounded-full text-sm font-bold text-black"
              style={{ backgroundColor: accentColor }}
            >
              Register Now
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
