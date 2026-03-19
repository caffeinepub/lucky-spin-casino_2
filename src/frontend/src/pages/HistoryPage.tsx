import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart2, TrendingDown, TrendingUp, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useTransactions } from "../hooks/useQueries";

function isWin(description: string, amount: bigint): boolean {
  if (Number(amount) <= 0) return false;
  const d = description.toLowerCase();
  return (
    d.includes("win") ||
    d.includes("won") ||
    d.includes("reward") ||
    d.includes("bonus")
  );
}

export default function HistoryPage() {
  const { data: transactions, isLoading } = useTransactions();

  const wins = (transactions ?? []).filter((tx) =>
    isWin(tx.description, tx.amount),
  );
  const losses = (transactions ?? []).filter((tx) => Number(tx.amount) < 0);
  const totalGames = wins.length + losses.length;
  const winRate =
    totalGames > 0 ? Math.round((wins.length / totalGames) * 100) : 0;
  const biggestPayout = (transactions ?? []).reduce(
    (max, tx) => (Number(tx.amount) > max ? Number(tx.amount) : max),
    0,
  );

  const recent = (transactions ?? []).slice(0, 20);

  const statCards = [
    {
      label: "Total Games",
      value: totalGames,
      icon: <BarChart2 className="w-5 h-5" />,
      color: "oklch(0.87 0.295 145)",
    },
    {
      label: "Total Wins",
      value: wins.length,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "oklch(0.75 0.25 145)",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: <Zap className="w-5 h-5" />,
      color: "oklch(0.82 0.19 80)",
    },
    {
      label: "Biggest Payout",
      value: `🪙 ${biggestPayout.toLocaleString()}`,
      icon: <Trophy className="w-5 h-5" />,
      color: "oklch(0.8 0.2 60)",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.966 0.189 101.5)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black uppercase text-black">
            📊 GAME HISTORY &amp; STATS
          </h1>
          <div
            className="w-32 h-1 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
          />
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          data-ocid="history.section"
        >
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className="rounded-2xl p-5 flex flex-col gap-2"
              style={{
                background: "#111",
                border: `2px solid ${card.color}`,
                boxShadow: `0 0 20px ${card.color}44`,
              }}
              data-ocid={`history.card.${i + 1}`}
            >
              <div style={{ color: card.color }}>{card.icon}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">
                {card.label}
              </div>
              <div className="text-2xl font-black text-white">
                {isLoading ? "—" : card.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Games Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "#111", border: "2px solid oklch(0.25 0 0)" }}
        >
          <div className="p-5 border-b border-gray-800 flex items-center gap-2">
            <BarChart2
              className="w-5 h-5"
              style={{ color: "oklch(0.87 0.295 145)" }}
            />
            <h2 className="font-black text-white text-xl">
              Recent Games (Last 20)
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="history.loading_state">
              {[1, 2, 3, 4, 5].map((n) => (
                <Skeleton key={n} className="h-12 bg-gray-800" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="p-12 text-center" data-ocid="history.empty_state">
              <div className="text-5xl mb-3">🎮</div>
              <div className="text-gray-400 text-lg font-semibold">
                No game history yet.
              </div>
              <div className="text-gray-500 text-sm mt-1">
                Play some games to see your stats here!
              </div>
            </div>
          ) : (
            <Table data-ocid="history.table">
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-bold">#</TableHead>
                  <TableHead className="text-gray-400 font-bold">
                    Game / Description
                  </TableHead>
                  <TableHead className="text-gray-400 font-bold">
                    Result
                  </TableHead>
                  <TableHead className="text-gray-400 font-bold text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-gray-400 font-bold text-right">
                    Balance After
                  </TableHead>
                  <TableHead className="text-gray-400 font-bold text-right">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((tx, i) => {
                  const win = isWin(tx.description, tx.amount);
                  const neutral = Number(tx.amount) === 0;
                  return (
                    <TableRow
                      key={`htx-${tx.timestamp}-${i}`}
                      className="border-gray-800 hover:bg-gray-900 transition-colors"
                      data-ocid={`history.row.${i + 1}`}
                    >
                      <TableCell className="text-gray-500 text-sm">
                        {i + 1}
                      </TableCell>
                      <TableCell className="text-white font-semibold text-sm max-w-[180px] truncate">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        {neutral ? (
                          <Badge
                            variant="outline"
                            className="text-gray-400 border-gray-600"
                          >
                            Neutral
                          </Badge>
                        ) : win ? (
                          <Badge
                            className="text-black font-bold"
                            style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
                          >
                            <TrendingUp className="w-3 h-3 mr-1" /> WIN
                          </Badge>
                        ) : (
                          <Badge
                            className="font-bold"
                            style={{
                              backgroundColor: "oklch(0.55 0.25 15)",
                              color: "white",
                            }}
                          >
                            <TrendingDown className="w-3 h-3 mr-1" /> LOSS
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold text-sm ${
                          Number(tx.amount) > 0
                            ? "text-green-400"
                            : Number(tx.amount) < 0
                              ? "text-red-400"
                              : "text-gray-400"
                        }`}
                      >
                        {Number(tx.amount) > 0 ? "+" : ""}
                        {Number(tx.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-gray-400 text-sm">
                        🪙 {Number(tx.balanceAfter).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-gray-500 text-xs">
                        {new Date(
                          Number(tx.timestamp) / 1_000_000,
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </div>
  );
}
