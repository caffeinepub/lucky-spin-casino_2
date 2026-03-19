import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { Gamepad2, Home, Plus, Trophy, Wallet } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { username, balance, isRegistered, setShowRegisterModal } = useUser();

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#111] border-b-2 border-[oklch(0.87_0.295_145)]"
      style={{ boxShadow: "0 4px 20px oklch(0.87 0.295 145 / 0.3)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <span className="text-2xl">🎰</span>
          <div className="leading-none">
            <div
              className="text-xs font-bold tracking-widest"
              style={{ color: "oklch(0.87 0.295 145)" }}
            >
              LUCKY SPIN
            </div>
            <div className="text-[10px] text-gray-400 tracking-wider">
              CASINO
            </div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white text-sm font-semibold tracking-wide transition-colors flex items-center gap-1"
            data-ocid="nav.home.link"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/games"
            className="text-gray-300 hover:text-white text-sm font-semibold tracking-wide transition-colors flex items-center gap-1"
            data-ocid="nav.games.link"
          >
            <Gamepad2 className="w-4 h-4" /> Games
          </Link>
          <Link
            to="/leaderboard"
            className="text-gray-300 hover:text-white text-sm font-semibold tracking-wide transition-colors flex items-center gap-1"
            data-ocid="nav.leaderboard.link"
          >
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
          <Link
            to="/wallet"
            className="text-gray-300 hover:text-white text-sm font-semibold tracking-wide transition-colors flex items-center gap-1"
            data-ocid="nav.wallet.link"
          >
            <Wallet className="w-4 h-4" /> Wallet
          </Link>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {isRegistered ? (
            <>
              <div
                className="flex items-center gap-2 bg-black rounded-full px-3 py-1 border"
                style={{ borderColor: "oklch(0.87 0.295 145)" }}
              >
                <span className="text-sm">🪙</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.87 0.295 145)" }}
                >
                  {Number(balance).toLocaleString()}
                </span>
              </div>
              <Link to="/wallet">
                <Button
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 font-bold text-black"
                  style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
                  data-ocid="wallet.add_button"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: "oklch(0.87 0.295 145)", color: "#000" }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 font-semibold">
                  {username}
                </span>
              </div>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowRegisterModal(true)}
              className="font-bold text-black"
              style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
              data-ocid="register.button"
            >
              🎮 Register & Play
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
