import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useRecentWins, useTopPlayers } from "../hooks/useQueries";

const GAMES = [
  {
    id: "mines",
    name: "MINES",
    emoji: "💣",
    path: "/games/mines",
    accent: "oklch(0.85 0.18 200)",
    desc: "Navigate bombs for big rewards",
    bg: "from-blue-950 to-cyan-950",
  },
  {
    id: "aviator",
    name: "AVIATOR",
    emoji: "✈️",
    path: "/games/aviator",
    accent: "oklch(0.6 0.3 335)",
    desc: "Cash out before the crash!",
    bg: "from-red-950 to-pink-950",
  },
  {
    id: "777slots",
    name: "777 SLOTS",
    emoji: "🎰",
    path: "/games/777slots",
    accent: "oklch(0.6 0.3 335)",
    desc: "Classic 3-reel jackpot slots",
    bg: "from-purple-950 to-pink-950",
  },
  {
    id: "500lucky",
    name: "500 LUCKY SLOT",
    emoji: "🍀",
    path: "/games/500lucky",
    accent: "oklch(0.65 0.28 290)",
    desc: "5-reel 500x jackpot madness",
    bg: "from-violet-950 to-purple-950",
  },
  {
    id: "fortunesgem",
    name: "FORTUNES GEM 500",
    emoji: "💎",
    path: "/games/fortunesgem",
    accent: "oklch(0.82 0.19 80)",
    desc: "Match gems for gold fortune",
    bg: "from-yellow-950 to-orange-950",
  },
  {
    id: "kraken",
    name: "POWER OF KRAKEN",
    emoji: "🐙",
    path: "/games/kraken",
    accent: "oklch(0.85 0.18 200)",
    desc: "Unleash the sea monster wins",
    bg: "from-teal-950 to-blue-950",
  },
];

const HERO_ICONS = ["💣", "💎", "⭐", "🍀", "🪙", "🍺"];

function JackpotCounter() {
  const [amount, setAmount] = useState(4827345);
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + Math.floor(Math.random() * 50 + 10));
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return (
    <span
      className="font-black text-2xl md:text-3xl animate-jackpot"
      style={{ color: "oklch(0.966 0.189 101.5)" }}
    >
      🪙 {amount.toLocaleString()}
    </span>
  );
}

export default function HomePage() {
  const { isRegistered, setShowRegisterModal } = useUser();
  const { data: recentWins } = useRecentWins();
  const { data: topPlayers } = useTopPlayers();

  const sampleWins = [
    { user: "LuckyPlayer24", game: "AVIATOR", amount: 5420 },
    { user: "SlotKing99", game: "777 SLOTS", amount: 3100 },
    { user: "GemHunter", game: "FORTUNES GEM", amount: 8800 },
    { user: "MinesMaster", game: "MINES", amount: 2200 },
    { user: "KrakenBoss", game: "KRAKEN", amount: 14500 },
    { user: "LuckyFour20", game: "500 LUCKY", amount: 50000 },
  ];

  const displayWins =
    recentWins && recentWins.length > 0
      ? recentWins.map((w) => ({
          user: `${w.user.toString().slice(0, 8)}...`,
          game: w.game,
          amount: Number(w.amountWon),
        }))
      : sampleWins;

  const samplePlayers = [
    { username: "KrakenBoss", totalWon: 148500n },
    { username: "SlotKing99", totalWon: 97200n },
    { username: "LuckyFour20", totalWon: 85000n },
  ];
  const displayPlayers =
    topPlayers && topPlayers.length > 0 ? topPlayers : samplePlayers;

  return (
    <div style={{ backgroundColor: "oklch(0.966 0.189 101.5)" }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-4 text-sm font-bold"
                style={{
                  background: "oklch(0.87 0.295 145 / 0.15)",
                  color: "oklch(0.87 0.295 145)",
                  border: "1px solid oklch(0.87 0.295 145 / 0.4)",
                }}
              >
                🔥 6 GAMES AVAILABLE NOW
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase leading-none text-white mb-4">
                SPIN TO
                <br />
                <span
                  style={{ color: "oklch(0.966 0.189 101.5)" }}
                  className="text-glow-yellow"
                >
                  WIN BIG!
                </span>
                <br />
                <span style={{ color: "oklch(0.87 0.295 145)" }}>🎰</span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-md">
                Play Mines, Aviator, 777 Slots, and more! Earn virtual coins and
                climb the leaderboard.
              </p>
              <div className="flex flex-wrap gap-4">
                {isRegistered ? (
                  <Link to="/games">
                    <Button
                      className="text-black font-black text-lg px-8 py-6 rounded-full"
                      style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
                      data-ocid="hero.play_button"
                    >
                      🎮 PLAY NOW
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => setShowRegisterModal(true)}
                    className="text-black font-black text-lg px-8 py-6 rounded-full"
                    style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
                    data-ocid="hero.register_button"
                  >
                    🎉 JOIN & GET 1000 COINS
                  </Button>
                )}
                <Link to="/leaderboard">
                  <Button
                    variant="outline"
                    className="font-bold text-lg px-8 py-6 rounded-full border-2"
                    style={{
                      borderColor: "oklch(0.966 0.189 101.5)",
                      color: "oklch(0.966 0.189 101.5)",
                    }}
                    data-ocid="hero.leaderboard.link"
                  >
                    🏆 LEADERBOARD
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div
                className="relative rounded-3xl overflow-hidden p-8"
                style={{
                  background: "linear-gradient(135deg, #1a0a2e, #0d1b2a)",
                  border: "2px solid oklch(0.87 0.295 145 / 0.5)",
                  boxShadow: "0 0 40px oklch(0.87 0.295 145 / 0.3)",
                }}
              >
                <div className="text-center">
                  <div className="text-8xl mb-4 animate-neon-flicker">🎰</div>
                  <div
                    className="text-6xl font-black"
                    style={{ color: "oklch(0.966 0.189 101.5)" }}
                  >
                    777
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    JACKPOT!
                  </div>
                  <div className="mt-4 flex justify-center gap-4 text-4xl">
                    <span className="animate-float-plane inline-block">✈️</span>
                    <span>💎</span>
                    <span>🐙</span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {HERO_ICONS.map((e) => (
                      <div
                        key={e}
                        className="rounded-lg p-3 text-2xl text-center"
                        style={{
                          background: "oklch(0.15 0.02 280)",
                          border: "1px solid oklch(0.3 0.1 280)",
                        }}
                      >
                        {e}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Winners Strip */}
      <div
        className="relative overflow-hidden py-3"
        style={{
          background: "#0d0d0d",
          borderTop: "2px solid oklch(0.87 0.295 145 / 0.3)",
          borderBottom: "2px solid oklch(0.87 0.295 145 / 0.3)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 absolute left-0 top-0 bottom-0 z-10"
          style={{
            background: "linear-gradient(to right, #0d0d0d 60%, transparent)",
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "oklch(0.87 0.295 145)" }}
          >
            🔥 LIVE
          </span>
        </div>
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap pl-20">
          {[...displayWins, ...displayWins].map((w, i) => (
            <span key={`win-${w.user}-${i}`} className="text-sm font-semibold">
              <span className="text-gray-400">{w.user}</span>
              <span className="text-white mx-1">won</span>
              <span
                className="font-bold"
                style={{ color: "oklch(0.87 0.295 145)" }}
              >
                🪙 {w.amount.toLocaleString()}
              </span>
              <span className="text-gray-500 ml-1">on {w.game}</span>
              <span className="mx-4 text-gray-700">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Games */}
      <section
        className="py-16"
        style={{ backgroundColor: "oklch(0.966 0.189 101.5)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black uppercase text-black">
              FEATURED GAMES
            </h2>
            <div
              className="w-24 h-1 mx-auto mt-3 rounded-full"
              style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
            />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="rounded-2xl overflow-hidden cursor-pointer group"
                style={{ border: `2px solid ${game.accent}` }}
                data-ocid={`games.item.${i + 1}`}
              >
                <div
                  className={`relative h-44 bg-gradient-to-br ${game.bg} flex items-center justify-center overflow-hidden`}
                >
                  <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </div>
                </div>
                <div className="bg-[#111] p-3 flex items-center justify-between">
                  <div>
                    <div className="font-black text-sm text-white uppercase tracking-wider">
                      {game.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {game.desc}
                    </div>
                  </div>
                  <Link to={game.path}>
                    <Button
                      size="sm"
                      className="text-black font-bold text-xs px-3"
                      style={{ backgroundColor: game.accent }}
                      data-ocid={`games.play.button.${i + 1}`}
                    >
                      PLAY
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jackpot & Top Winners */}
      <section className="py-12" style={{ background: "#111" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
              border: "2px solid oklch(0.966 0.189 101.5 / 0.4)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  🌟 CURRENT JACKPOT
                </div>
                <JackpotCounter />
                <div className="text-xs text-gray-500 mt-1">virtual coins</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  🏆 TOP WINNERS
                </div>
                <div className="space-y-2">
                  {displayPlayers.slice(0, 3).map((p, i) => (
                    <div
                      key={p.username}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: "oklch(0.15 0 0)" }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                        </span>
                        <span className="text-white font-semibold text-sm">
                          {p.username}
                        </span>
                      </div>
                      <span
                        className="font-bold text-sm"
                        style={{ color: "oklch(0.966 0.189 101.5)" }}
                      >
                        🪙 {Number(p.totalWon).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
