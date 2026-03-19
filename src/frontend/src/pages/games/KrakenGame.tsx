import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import GameLayout from "../../components/GameLayout";
import { useUser } from "../../context/UserContext";
import { useActor } from "../../hooks/useActor";

const SYMBOLS = ["🐙", "🦑", "🐠", "🐚", "⚓", "🌊", "💎"];
const BET_AMOUNTS = [10, 50, 100, 500, 1000];
const KRAKEN = "🐙";
const REEL_KEYS = ["kr0", "kr1", "kr2", "kr3", "kr4"];
const CELL_KEYS = [
  ["r0c0", "r0c1", "r0c2"],
  ["r1c0", "r1c1", "r1c2"],
  ["r2c0", "r2c1", "r2c2"],
  ["r3c0", "r3c1", "r3c2"],
  ["r4c0", "r4c1", "r4c2"],
];

function getReels(): string[][] {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 3 }, () => {
      const r = Math.random();
      if (r < 0.12) return KRAKEN;
      return SYMBOLS[1 + Math.floor(Math.random() * (SYMBOLS.length - 1))];
    }),
  );
}

function calcKrakenWin(
  reels: string[][],
  bet: number,
): { won: boolean; amount: number; freeSpins: number; line: string } {
  const middle = reels.map((r) => r[1]);
  const krakenCount = middle.filter((s) => s === KRAKEN).length;
  const withWild = [...middle];
  if (krakenCount >= 1) {
    const nonKraken = withWild.find((s) => s !== KRAKEN);
    if (nonKraken) {
      for (let idx = 0; idx < withWild.length; idx++) {
        if (withWild[idx] === KRAKEN) withWild[idx] = nonKraken;
      }
    }
  }
  const counts: Record<string, number> = {};
  for (const s of withWild) {
    counts[s] = (counts[s] ?? 0) + 1;
  }
  const max = Math.max(...Object.values(counts));
  const topSym = Object.keys(counts).find((k) => counts[k] === max) ?? "";
  const freeSpins = krakenCount >= 3 ? 5 : 0;
  if (max === 5)
    return {
      won: true,
      amount: bet * (topSym === KRAKEN ? 200 : 50),
      freeSpins,
      line: `5x ${topSym} (MEGA WIN!)`,
    };
  if (max === 4)
    return { won: true, amount: bet * 20, freeSpins, line: `4x ${topSym}` };
  if (max === 3)
    return { won: true, amount: bet * 8, freeSpins, line: `3x ${topSym}` };
  if (krakenCount >= 3)
    return {
      won: true,
      amount: bet * 3,
      freeSpins,
      line: `${krakenCount}x Kraken Wild!`,
    };
  if (max === 2)
    return {
      won: true,
      amount: Math.floor(bet * 1.5),
      freeSpins,
      line: `2x ${topSym}`,
    };
  return { won: false, amount: 0, freeSpins, line: "No match" };
}

export default function KrakenGame() {
  const { balance, setBalance, isRegistered, setShowRegisterModal } = useUser();
  const { actor } = useActor();
  const [bet, setBet] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>(() =>
    Array.from({ length: 5 }, () => ["🐙", "🌊", "⚓"]),
  );
  const [spinMask, setSpinMask] = useState([false, false, false, false, false]);
  const [result, setResult] = useState<{
    won: boolean;
    amount: number;
    freeSpins: number;
    line: string;
  } | null>(null);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState(0);

  const accentColor = "oklch(0.85 0.18 200)";

  const doSpin = useCallback(
    async (freeSpin = false) => {
      if (!freeSpin) {
        if (!isRegistered) {
          setShowRegisterModal(true);
          return;
        }
        if (balance < BigInt(bet)) {
          toast.error("Insufficient balance!");
          return;
        }
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
              const res = calcKrakenWin(finalReels, bet);
              setResult(res);
              setSpinning(false);
              if (res.freeSpins > 0) {
                setFreeSpinsLeft((prev) => prev + res.freeSpins);
                toast.success(`🐙 ${res.freeSpins} FREE SPINS UNLOCKED!`, {
                  duration: 4000,
                });
              }
              if (res.won) {
                toast.success(`🌊 ${res.line}! Won 🪙 ${res.amount}`, {
                  duration: 3000,
                });
              } else if (!freeSpin) {
                toast.error("No win. Try again!", { duration: 2000 });
              }
              if (actor) {
                actor
                  .submitGameResult(
                    "POWER OF KRAKEN",
                    res.won,
                    BigInt(res.won ? res.amount : bet),
                  )
                  .then(() => actor.getBalance())
                  .then(setBalance)
                  .catch(() => {});
              }
              if (freeSpin && freeSpinsLeft > 0)
                setFreeSpinsLeft((prev) => prev - 1);
            }
          },
          400 + i * 250,
        );
      }
    },
    [
      bet,
      balance,
      isRegistered,
      setShowRegisterModal,
      actor,
      setBalance,
      freeSpinsLeft,
    ],
  );

  const handleFreeSpinOrSpin = () => {
    if (freeSpinsLeft > 0) doSpin(true);
    else doSpin(false);
  };

  return (
    <GameLayout title="POWER OF KRAKEN" emoji="🐙" accentColor={accentColor}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, #001a1a, #00292b)",
            border: `3px solid ${accentColor}`,
            boxShadow: "0 0 40px oklch(0.85 0.18 200 / 0.4)",
          }}
        >
          <div className="text-center mb-4">
            <span className="font-black text-xl" style={{ color: accentColor }}>
              🐙 POWER OF KRAKEN 🐙
            </span>
            {freeSpinsLeft > 0 && (
              <div
                className="mt-1 inline-block ml-3 px-3 py-0.5 rounded-full text-sm font-bold"
                style={{ background: "oklch(0.87 0.295 145)", color: "#000" }}
              >
                🌠 {freeSpinsLeft} FREE SPINS
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-center mb-4">
            {reels.map((reel, ri) => (
              <div key={REEL_KEYS[ri]} className="flex flex-col gap-1">
                {reel.map((sym, si) => (
                  <div
                    key={CELL_KEYS[ri][si]}
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: si === 1 ? "#003344" : "#001a22",
                      border: `2px solid ${si === 1 ? accentColor : "#004455"}`,
                      boxShadow:
                        si === 1 && sym === KRAKEN
                          ? `0 0 20px ${accentColor}`
                          : "none",
                    }}
                  >
                    {spinMask[ri] ? (
                      <motion.span
                        animate={{ y: [0, -8, 8, 0] }}
                        transition={{
                          duration: 0.12,
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
          <div className="text-center text-xs text-gray-500 mb-3">
            🐙 Kraken = Wild! Land 3+ for Free Spins
          </div>
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-3 rounded-xl text-center"
                style={{
                  background: result.won ? "oklch(0.1 0.06 200)" : "#111",
                  border: `1px solid ${result.won ? accentColor : "#333"}`,
                }}
                data-ocid={
                  result.won ? "kraken.success_state" : "kraken.error_state"
                }
              >
                <div
                  className="font-black text-xl"
                  style={{ color: result.won ? accentColor : "#888" }}
                >
                  {result.won
                    ? `🌊 ${result.line}! +🪙 ${result.amount}`
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
          <div className="text-gray-400 text-sm mb-2">Bet Amount</div>
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
                data-ocid="kraken.bet.toggle"
              >
                {a}
              </button>
            ))}
          </div>
          <Button
            onClick={handleFreeSpinOrSpin}
            disabled={spinning}
            className="w-full font-black text-black text-xl py-4"
            style={{
              backgroundColor:
                freeSpinsLeft > 0 ? "oklch(0.87 0.295 145)" : accentColor,
            }}
            data-ocid="kraken.spin.primary_button"
          >
            {spinning
              ? "🐙 SPINNING..."
              : freeSpinsLeft > 0
                ? `🌠 FREE SPIN (${freeSpinsLeft} left)`
                : `🐙 SPIN - 🪙 ${bet}`}
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
