import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import GameLayout from "../../components/GameLayout";
import { useUser } from "../../context/UserContext";
import { useActor } from "../../hooks/useActor";

const SYMBOLS = ["🍀", "💰", "⭐", "🎯", "🌟", "💎", "7"];
const BET_AMOUNTS = [10, 50, 100, 500, 1000];
const PAYLINES = 5;
const REEL_KEYS = ["r0", "r1", "r2", "r3", "r4"];
const CELL_KEYS = [
  ["r0c0", "r0c1", "r0c2"],
  ["r1c0", "r1c1", "r1c2"],
  ["r2c0", "r2c1", "r2c2"],
  ["r3c0", "r3c1", "r3c2"],
  ["r4c0", "r4c1", "r4c2"],
];

function getReels(): string[][] {
  return Array.from({ length: 5 }, () =>
    Array.from(
      { length: 3 },
      () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ),
  );
}

function calcWin(
  reels: string[][],
  bet: number,
): { won: boolean; amount: number; line: string } {
  const middle = reels.map((r) => r[1]);
  const counts: Record<string, number> = {};
  for (const s of middle) {
    counts[s] = (counts[s] ?? 0) + 1;
  }
  const max = Math.max(...Object.values(counts));
  const symbol = Object.keys(counts).find((k) => counts[k] === max) ?? "";
  if (middle.every((s) => s === "🍀"))
    return { won: true, amount: bet * 500, line: "5x CLOVER - JACKPOT!" };
  if (max === 5) return { won: true, amount: bet * 50, line: `5x ${symbol}` };
  if (max === 4) return { won: true, amount: bet * 15, line: `4x ${symbol}` };
  if (max === 3) return { won: true, amount: bet * 5, line: `3x ${symbol}` };
  if (max === 2)
    return { won: true, amount: Math.floor(bet * 1.5), line: `2x ${symbol}` };
  return { won: false, amount: 0, line: "No match" };
}

export default function Lucky500Game() {
  const { balance, setBalance, isRegistered, setShowRegisterModal } = useUser();
  const { actor } = useActor();
  const [bet, setBet] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>(() =>
    Array.from({ length: 5 }, () => ["🍀", "💰", "⭐"]),
  );
  const [spinMask, setSpinMask] = useState([false, false, false, false, false]);
  const [result, setResult] = useState<{
    won: boolean;
    amount: number;
    line: string;
  } | null>(null);

  const accentColor = "oklch(0.65 0.28 290)";

  const spin = useCallback(async () => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    if (balance < BigInt(bet)) {
      toast.error("Insufficient balance!");
      return;
    }
    setSpinning(true);
    setResult(null);
    setSpinMask([true, true, true, true, true]);
    const finalReels = getReels();
    for (const i of [0, 1, 2, 3, 4]) {
      setTimeout(
        () => {
          setSpinMask((prev) => {
            const n = [...prev];
            n[i] = false;
            return n;
          });
          setReels((prev) => {
            const n = [...prev];
            n[i] = finalReels[i];
            return n;
          });
          if (i === 4) {
            const res = calcWin(finalReels, bet);
            setResult(res);
            setSpinning(false);
            if (res.won) {
              toast.success(`🍀 ${res.line}! Won 🪙 ${res.amount}`, {
                duration: 4000,
              });
            } else {
              toast.error("No win this time!", { duration: 2000 });
            }
            if (actor) {
              actor
                .submitGameResult(
                  "500 LUCKY SLOT",
                  res.won,
                  BigInt(res.won ? res.amount : bet),
                )
                .then(() => actor.getBalance())
                .then(setBalance)
                .catch(() => {});
            }
          }
        },
        500 + i * 300,
      );
    }
  }, [bet, balance, isRegistered, setShowRegisterModal, actor, setBalance]);

  return (
    <GameLayout title="500 LUCKY SLOT" emoji="🍀" accentColor={accentColor}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, #12003a, #1e0035)",
            border: `3px solid ${accentColor}`,
            boxShadow: "0 0 40px oklch(0.65 0.28 290 / 0.4)",
          }}
        >
          <div className="text-center mb-4">
            <span
              className="font-black text-2xl"
              style={{ color: accentColor }}
            >
              500x JACKPOT 🍀🍀🍀🍀🍀
            </span>
          </div>
          <div className="flex gap-2 justify-center mb-4">
            {reels.map((reel, ri) => (
              <div key={REEL_KEYS[ri]} className="flex flex-col gap-1">
                {reel.map((sym, si) => (
                  <div
                    key={CELL_KEYS[ri][si]}
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
                    style={{
                      background: si === 1 ? "#1a0040" : "#0f0020",
                      border:
                        si === 1
                          ? `2px solid ${accentColor}`
                          : "1px solid #333",
                      boxShadow:
                        si === 1 && spinMask[ri]
                          ? `0 0 15px ${accentColor}`
                          : "none",
                    }}
                  >
                    {spinMask[ri] ? (
                      <motion.span
                        animate={{ y: [0, -10, 10, 0] }}
                        transition={{
                          duration: 0.1,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        {SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}
                      </motion.span>
                    ) : (
                      sym
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500 mb-2">
            ← Payline (middle row) →
          </div>
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-3 rounded-xl text-center"
                style={{
                  background: result.won ? "oklch(0.12 0.06 290)" : "#111",
                  border: `1px solid ${result.won ? accentColor : "#333"}`,
                }}
                data-ocid={
                  result.won ? "lucky500.success_state" : "lucky500.error_state"
                }
              >
                <div
                  className="font-black text-xl"
                  style={{ color: result.won ? accentColor : "#888" }}
                >
                  {result.won
                    ? `🎉 ${result.line}! +🪙 ${result.amount}`
                    : result.line}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          className="rounded-2xl p-6"
          style={{ background: "#1a1a1a", border: `2px solid ${accentColor}` }}
        >
          <div className="text-gray-400 text-sm mb-2">
            Bet Amount ({PAYLINES} paylines)
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            {BET_AMOUNTS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setBet(a)}
                disabled={spinning}
                className="px-4 py-2 rounded-lg font-bold text-sm"
                style={{
                  background: bet === a ? accentColor : "#333",
                  color: bet === a ? "#000" : "#fff",
                }}
                data-ocid="lucky500.bet.toggle"
              >
                {a}
              </button>
            ))}
          </div>
          <Button
            onClick={spin}
            disabled={spinning}
            className="w-full font-black text-black text-xl py-4"
            style={{ backgroundColor: accentColor }}
            data-ocid="lucky500.spin.primary_button"
          >
            {spinning ? "🍀 SPINNING..." : `🍀 SPIN - 🪙 ${bet}`}
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
