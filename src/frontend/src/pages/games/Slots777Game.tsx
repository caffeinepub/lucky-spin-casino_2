import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import GameLayout from "../../components/GameLayout";
import { useUser } from "../../context/UserContext";
import { useActor } from "../../hooks/useActor";

const SYMBOLS = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎", "7"];
const PAYOUTS: Record<string, number> = {
  "7,7,7": 50,
  "💎,💎,💎": 20,
  "⭐,⭐,⭐": 15,
  "🔔,🔔,🔔": 10,
  "🍇,🍇,🍇": 8,
  "🍋,🍋,🍋": 5,
  "🍒,🍒,🍒": 4,
};
const BET_AMOUNTS = [10, 50, 100, 500, 1000];
const REEL_KEYS = ["reel-0", "reel-1", "reel-2"];

function getResult(): string[] {
  return [0, 1, 2].map(
    () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  );
}

function calcPayout(reels: string[], bet: number): number {
  const key = reels.join(",");
  if (PAYOUTS[key]) return bet * PAYOUTS[key];
  if (reels[0] === reels[1] || reels[1] === reels[2])
    return Math.floor(bet * 1.5);
  return 0;
}

export default function Slots777Game() {
  const { balance, setBalance, isRegistered, setShowRegisterModal } = useUser();
  const { actor } = useActor();
  const [bet, setBet] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(["🎰", "🎰", "🎰"]);
  const [spinReels, setSpinReels] = useState([false, false, false]);
  const [result, setResult] = useState<{ won: boolean; amount: number } | null>(
    null,
  );

  const accentColor = "oklch(0.6 0.3 335)";

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
    setSpinReels([true, true, true]);
    const finalReels = getResult();
    for (const i of [0, 1, 2]) {
      setTimeout(
        () => {
          setSpinReels((prev) => {
            const n = [...prev];
            n[i] = false;
            return n;
          });
          setReels((prev) => {
            const n = [...prev];
            n[i] = finalReels[i];
            return n;
          });
          if (i === 2) {
            const payout = calcPayout(finalReels, bet);
            const won = payout > 0;
            setResult({ won, amount: payout });
            setSpinning(false);
            if (won) {
              toast.success(`🎉 Won 🪙 ${payout}!`, { duration: 3000 });
            } else {
              toast.error("No match. Try again!", { duration: 2000 });
            }
            if (actor) {
              actor
                .submitGameResult("777 SLOTS", won, BigInt(won ? payout : bet))
                .then(() => actor.getBalance())
                .then(setBalance)
                .catch(() => {});
            }
          }
        },
        600 + i * 400,
      );
    }
  }, [bet, balance, isRegistered, setShowRegisterModal, actor, setBalance]);

  return (
    <GameLayout title="777 SLOTS" emoji="🎰" accentColor={accentColor}>
      <div className="max-w-lg mx-auto">
        <div
          className="rounded-2xl p-8 mb-6 text-center"
          style={{
            background: "linear-gradient(135deg, #1a0a2e, #250a3a)",
            border: `3px solid ${accentColor}`,
            boxShadow: "0 0 40px oklch(0.6 0.3 335 / 0.4)",
          }}
        >
          <div
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: accentColor }}
          >
            🎰 LUCKY 777 SLOTS
          </div>
          <div className="flex justify-center gap-4 mb-6">
            {reels.map((symbol, i) => (
              <div
                key={REEL_KEYS[i]}
                className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl"
                style={{
                  background: "#0a0a1a",
                  border: `2px solid ${accentColor}`,
                  boxShadow: spinReels[i] ? `0 0 20px ${accentColor}` : "none",
                }}
              >
                {spinReels[i] ? (
                  <motion.div
                    animate={{ y: [0, -30, 30, 0] }}
                    transition={{
                      duration: 0.15,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    {SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]}
                  </motion.div>
                ) : (
                  <motion.div
                    key={symbol}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {symbol}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 py-3 rounded-xl"
                style={{
                  background: result.won
                    ? "oklch(0.15 0.08 145)"
                    : "oklch(0.15 0.05 0)",
                  border: `1px solid ${result.won ? "oklch(0.87 0.295 145)" : "#444"}`,
                }}
                data-ocid={
                  result.won ? "slots.success_state" : "slots.error_state"
                }
              >
                <div
                  className="font-black text-xl"
                  style={{
                    color: result.won ? "oklch(0.87 0.295 145)" : "#888",
                  }}
                >
                  {result.won ? `🎉 WON 🪙 ${result.amount}!` : "No match!"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: "#111", border: "1px solid #333" }}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Pay Table
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(PAYOUTS).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between px-2 py-1 rounded"
                style={{ background: "#1a1a1a" }}
              >
                <span>{k.replaceAll(",", " ")}</span>
                <span className="font-bold" style={{ color: accentColor }}>
                  {v}x
                </span>
              </div>
            ))}
          </div>
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
                data-ocid="slots.bet.toggle"
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
            data-ocid="slots.spin.primary_button"
          >
            {spinning ? "🎰 SPINNING..." : `🎰 SPIN - 🪙 ${bet}`}
          </Button>
        </div>
      </div>
    </GameLayout>
  );
}
