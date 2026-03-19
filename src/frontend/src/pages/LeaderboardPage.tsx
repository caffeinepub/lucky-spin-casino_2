import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useRecentWins, useTopPlayers } from "../hooks/useQueries";

const SAMPLE_PLAYERS = [
  { username: "KrakenBoss", totalWon: 148500n, balance: 85000n, phone: "" },
  { username: "SlotKing99", totalWon: 97200n, balance: 42000n, phone: "" },
  { username: "LuckyFour20", totalWon: 85000n, balance: 65000n, phone: "" },
  { username: "GemHunter", totalWon: 72300n, balance: 33000n, phone: "" },
  { username: "AviatorAce", totalWon: 61000n, balance: 28000n, phone: "" },
  { username: "MinesMaster", totalWon: 54800n, balance: 19500n, phone: "" },
  { username: "LuckyPlayer24", totalWon: 48200n, balance: 31000n, phone: "" },
  { username: "SpinQueen", totalWon: 39900n, balance: 22000n, phone: "" },
];

const SAMPLE_WINS = [
  {
    game: "AVIATOR",
    user: { toString: () => "KrakenBoss" } as any,
    amountWon: 14500n,
    timestamp: BigInt(Date.now()),
  },
  {
    game: "500 LUCKY SLOT",
    user: { toString: () => "LuckyFour20" } as any,
    amountWon: 50000n,
    timestamp: BigInt(Date.now()),
  },
  {
    game: "MINES",
    user: { toString: () => "MinesMaster" } as any,
    amountWon: 8200n,
    timestamp: BigInt(Date.now()),
  },
  {
    game: "777 SLOTS",
    user: { toString: () => "SlotKing99" } as any,
    amountWon: 4400n,
    timestamp: BigInt(Date.now()),
  },
  {
    game: "FORTUNES GEM",
    user: { toString: () => "GemHunter" } as any,
    amountWon: 12000n,
    timestamp: BigInt(Date.now()),
  },
];

export default function LeaderboardPage() {
  const { data: topPlayers, isLoading: playersLoading } = useTopPlayers();
  const { data: recentWins, isLoading: winsLoading } = useRecentWins();
  const players =
    topPlayers && topPlayers.length > 0 ? topPlayers : SAMPLE_PLAYERS;
  const wins = recentWins && recentWins.length > 0 ? recentWins : SAMPLE_WINS;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.966 0.189 101.5)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black uppercase text-black">
            🏆 LEADERBOARD
          </h1>
          <div
            className="w-32 h-1 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
          />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "2px solid oklch(0.966 0.189 101.5 / 0.5)",
                background: "#111",
              }}
            >
              <div className="p-4 border-b border-gray-800">
                <h2 className="font-black text-white text-lg uppercase">
                  🏆 Top Players
                </h2>
              </div>
              {playersLoading ? (
                <div
                  className="p-4 space-y-3"
                  data-ocid="leaderboard.loading_state"
                >
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-12 bg-gray-800" />
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-3" data-ocid="leaderboard.table">
                  {players.map((player, i) => (
                    <motion.div
                      key={player.username}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        background: "oklch(0.13 0 0)",
                        border: "1px solid oklch(0.2 0 0)",
                      }}
                      data-ocid={`leaderboard.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-8">
                          {medals[i] ?? `#${i + 1}`}
                        </span>
                        <div>
                          <div className="font-bold text-white">
                            {player.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            Balance: 🪙{" "}
                            {Number(player.balance).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-black"
                          style={{ color: "oklch(0.966 0.189 101.5)" }}
                        >
                          {Number(player.totalWon).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">total won</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "2px solid oklch(0.87 0.295 145 / 0.5)",
                background: "#111",
              }}
            >
              <div className="p-4 border-b border-gray-800">
                <h2 className="font-black text-white text-lg uppercase">
                  🔥 Recent Wins
                </h2>
              </div>
              {winsLoading ? (
                <div className="p-4 space-y-3" data-ocid="wins.loading_state">
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-12 bg-gray-800" />
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {wins.map((win, i) => (
                    <motion.div
                      key={`win-${win.game}-${i}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl px-4 py-3"
                      style={{
                        background: "oklch(0.13 0 0)",
                        border: "1px solid oklch(0.2 0 0)",
                      }}
                      data-ocid={`wins.item.${i + 1}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold text-sm">
                          {win.user.toString().slice(0, 14)}
                        </span>
                        <span
                          className="font-black text-sm"
                          style={{ color: "oklch(0.87 0.295 145)" }}
                        >
                          +{Number(win.amountWon).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{win.game}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
