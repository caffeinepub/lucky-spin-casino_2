import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

const GAMES = [
  {
    id: "mines",
    name: "MINES",
    emoji: "💣",
    path: "/games/mines",
    accent: "oklch(0.85 0.18 200)",
    desc: "Navigate the minefield! Pick tiles for diamonds or bombs.",
    label: "Strategy",
    multiplier: "Up to 24x",
    bg: "from-blue-950 to-cyan-950",
  },
  {
    id: "aviator",
    name: "AVIATOR",
    emoji: "✈️",
    path: "/games/aviator",
    accent: "oklch(0.6 0.3 335)",
    desc: "Watch the multiplier soar! Cash out before crash.",
    label: "Crash",
    multiplier: "Up to 20x",
    bg: "from-red-950 to-pink-950",
  },
  {
    id: "777slots",
    name: "777 SLOTS",
    emoji: "🎰",
    path: "/games/777slots",
    accent: "oklch(0.6 0.3 335)",
    desc: "Classic 3-reel slot with cherries, bells and lucky 7s.",
    label: "Classic",
    multiplier: "Up to 50x",
    bg: "from-purple-950 to-pink-950",
  },
  {
    id: "500lucky",
    name: "500 LUCKY SLOT",
    emoji: "🍀",
    path: "/games/500lucky",
    accent: "oklch(0.65 0.28 290)",
    desc: "5-reel power slots with 500x jackpot for 5 clovers!",
    label: "5-Reel",
    multiplier: "Up to 500x",
    bg: "from-violet-950 to-purple-950",
  },
  {
    id: "fortunesgem",
    name: "FORTUNES GEM 500",
    emoji: "💎",
    path: "/games/fortunesgem",
    accent: "oklch(0.82 0.19 80)",
    desc: "Match 3+ adjacent gems for cascading gold payouts.",
    label: "Gem Match",
    multiplier: "Up to 100x",
    bg: "from-yellow-950 to-orange-950",
  },
  {
    id: "kraken",
    name: "POWER OF KRAKEN",
    emoji: "🐙",
    path: "/games/kraken",
    accent: "oklch(0.85 0.18 200)",
    desc: "Deep sea 5-reel adventure with wild Kraken symbols!",
    label: "Wild Slots",
    multiplier: "Up to 200x",
    bg: "from-teal-950 to-blue-950",
  },
];

export default function GamesPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.966 0.189 101.5)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black uppercase text-black">
            🎮 ALL GAMES
          </h1>
          <p className="text-gray-800 mt-2 font-semibold">
            Choose your game and start winning!
          </p>
          <div
            className="w-32 h-1 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
          />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: `2px solid ${game.accent}`, background: "#111" }}
              data-ocid={`games.item.${i + 1}`}
            >
              <div
                className={`h-48 bg-gradient-to-br ${game.bg} flex items-center justify-center relative`}
              >
                <div className="text-8xl">{game.emoji}</div>
                <div
                  className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: game.accent, color: "#000" }}
                >
                  {game.label}
                </div>
                <div
                  className="absolute bottom-3 left-3 text-xs font-bold"
                  style={{ color: game.accent }}
                >
                  📈 {game.multiplier}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-white text-lg mb-2">
                  {game.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{game.desc}</p>
                <Link to={game.path}>
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl font-black text-black text-sm uppercase tracking-wider transition-all hover:brightness-110"
                    style={{ backgroundColor: game.accent }}
                    data-ocid={`games.play.button.${i + 1}`}
                  >
                    🎮 PLAY NOW
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
