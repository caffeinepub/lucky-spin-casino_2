import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import GameLayout from "../../components/GameLayout";
import { useUser } from "../../context/UserContext";
import { useActor } from "../../hooks/useActor";

const GEMS = ["💎", "💠", "🔷", "🟦", "🟢", "🟡", "🔴"];
const GRID = 5;
const BET_AMOUNTS = [10, 50, 100, 500, 1000];
const GEM_KEYS = Array.from(
  { length: GRID * GRID },
  (_, i) => `g${Math.floor(i / GRID)}x${i % GRID}`,
);

function makeGrid(): string[] {
  return Array.from(
    { length: GRID * GRID },
    () => GEMS[Math.floor(Math.random() * GEMS.length)],
  );
}

function findMatches(grid: string[]): Set<number> {
  const matched = new Set<number>();
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID - 2; c++) {
      const i = r * GRID + c;
      if (grid[i] === grid[i + 1] && grid[i] === grid[i + 2]) {
        matched.add(i);
        matched.add(i + 1);
        matched.add(i + 2);
        if (c + 3 < GRID && grid[i] === grid[i + 3]) matched.add(i + 3);
        if (c + 4 < GRID && grid[i] === grid[i + 4]) matched.add(i + 4);
      }
    }
  }
  for (let r = 0; r < GRID - 2; r++) {
    for (let c = 0; c < GRID; c++) {
      const i = r * GRID + c;
      if (grid[i] === grid[i + GRID] && grid[i] === grid[i + 2 * GRID]) {
        matched.add(i);
        matched.add(i + GRID);
        matched.add(i + 2 * GRID);
        if (r + 3 < GRID) matched.add(i + 3 * GRID);
        if (r + 4 < GRID) matched.add(i + 4 * GRID);
      }
    }
  }
  return matched;
}

export default function FortunesGemGame() {
  const { balance, setBalance, isRegistered, setShowRegisterModal } = useUser();
  const { actor } = useActor();
  const [bet, setBet] = useState(100);
  const [grid, setGrid] = useState<string[]>(() => makeGrid());
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState(false);
  const [totalWin, setTotalWin] = useState(0);
  const [cascadeCount, setCascadeCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const accentColor = "oklch(0.82 0.19 80)";

  const processMatches = useCallback(
    (
      currentGrid: string[],
      betAmt: number,
      cascades: number,
      accumulated: number,
    ) => {
      const matches = findMatches(currentGrid);
      if (matches.size === 0) {
        setGameOver(true);
        setPlaying(false);
        if (accumulated > 0) {
          toast.success(`💎 Total win: 🪙 ${accumulated}!`, { duration: 4000 });
          if (actor) {
            actor
              .submitGameResult("FORTUNES GEM 500", true, BigInt(accumulated))
              .then(() => actor.getBalance())
              .then(setBalance)
              .catch(() => {});
          }
        } else {
          toast.error("No matches found!", { duration: 2000 });
          if (actor) {
            actor
              .submitGameResult("FORTUNES GEM 500", false, BigInt(betAmt))
              .then(() => actor.getBalance())
              .then(setBalance)
              .catch(() => {});
          }
        }
        return;
      }
      setMatched(matches);
      const winAmount = Math.floor(
        betAmt * (matches.size / 3) * (1 + cascades * 0.5),
      );
      const newTotal = accumulated + winAmount;
      setTotalWin(newTotal);
      setCascadeCount(cascades + 1);
      toast.success(`💠 ${matches.size} gems matched! +🪙 ${winAmount}`);
      setTimeout(() => {
        const newGrid = [...currentGrid];
        for (const idx of matches) {
          newGrid[idx] = GEMS[Math.floor(Math.random() * GEMS.length)];
        }
        setGrid(newGrid);
        setMatched(new Set());
        setTimeout(
          () => processMatches(newGrid, betAmt, cascades + 1, newTotal),
          500,
        );
      }, 800);
    },
    [actor, setBalance],
  );

  const spinGrid = useCallback(() => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    if (balance < BigInt(bet)) {
      toast.error("Insufficient balance!");
      return;
    }
    setPlaying(true);
    setGameOver(false);
    setTotalWin(0);
    setCascadeCount(0);
    const newGrid = makeGrid();
    setGrid(newGrid);
    setMatched(new Set());
    setTimeout(() => processMatches(newGrid, bet, 0, 0), 300);
  }, [bet, balance, isRegistered, setShowRegisterModal, processMatches]);

  return (
    <GameLayout title="FORTUNES GEM 500" emoji="💎" accentColor={accentColor}>
      <div className="max-w-lg mx-auto">
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, #1a1000, #2a1800)",
            border: `3px solid ${accentColor}`,
            boxShadow: "0 0 40px oklch(0.82 0.19 80 / 0.4)",
          }}
        >
          <div className="text-center mb-4">
            <span className="font-black text-xl" style={{ color: accentColor }}>
              FORTUNES GEM 500 💎
            </span>
            {cascadeCount > 0 && (
              <span
                className="ml-3 text-sm"
                style={{ color: "oklch(0.87 0.295 145)" }}
              >
                x{cascadeCount} cascade!
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {grid.map((gem, i) => (
              <motion.div
                key={GEM_KEYS[i]}
                animate={
                  matched.has(i)
                    ? { scale: [1, 1.3, 0.8, 1], rotate: [0, 15, -15, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4 }}
                className="w-full aspect-square rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: matched.has(i) ? "oklch(0.3 0.15 80)" : "#1a1200",
                  border: `2px solid ${matched.has(i) ? accentColor : "#3a2a00"}`,
                  boxShadow: matched.has(i)
                    ? `0 0 15px ${accentColor}`
                    : "none",
                }}
              >
                {gem}
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {totalWin > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-3 rounded-xl text-center"
                style={{
                  background: "oklch(0.15 0.08 80)",
                  border: `1px solid ${accentColor}`,
                }}
                data-ocid="gem.success_state"
              >
                <div
                  className="font-black text-xl"
                  style={{ color: accentColor }}
                >
                  🎉 Total Win: 🪙 {totalWin}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className="rounded-2xl p-6"
          style={{ background: "#1a1a1a", border: `2px solid ${accentColor}` }}
        >
          <div className="text-gray-400 text-sm mb-2">Bet Amount</div>
          <div className="flex gap-2 flex-wrap mb-4">
            {BET_AMOUNTS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setBet(a)}
                disabled={playing}
                className="px-4 py-2 rounded-lg font-bold text-sm"
                style={{
                  background: bet === a ? accentColor : "#333",
                  color: bet === a ? "#000" : "#fff",
                }}
                data-ocid="gem.bet.toggle"
              >
                {a}
              </button>
            ))}
          </div>
          <Button
            onClick={spinGrid}
            disabled={playing}
            className="w-full font-black text-black text-xl py-4"
            style={{ backgroundColor: accentColor }}
            data-ocid="gem.spin.primary_button"
          >
            {playing ? "💎 Processing..." : `💎 SPIN GEMS - 🪙 ${bet}`}
          </Button>
          {gameOver && totalWin === 0 && (
            <p className="text-center text-gray-400 text-sm mt-3">
              No matches this time! Try again.
            </p>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
