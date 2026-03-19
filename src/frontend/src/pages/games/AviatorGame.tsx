import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import GameLayout from "../../components/GameLayout";
import { useUser } from "../../context/UserContext";
import { useActor } from "../../hooks/useActor";

const BET_AMOUNTS = [10, 50, 100, 500, 1000];
const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: `${(i * 17 + 5) % 100}%`,
  left: `${(i * 23 + 7) % 100}%`,
}));

export default function AviatorGame() {
  const { balance, setBalance, isRegistered, setShowRegisterModal } = useUser();
  const { actor } = useActor();
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<
    "idle" | "flying" | "crashed" | "cashedout"
  >("idle");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(2.0);
  const [cashedOutAt, setCashedOutAt] = useState(0);
  const [autoCashout, setAutoCashout] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const multiplierRef = useRef(1.0);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleCashOut = useCallback(
    async (currentMult?: number) => {
      stopInterval();
      const finalMult = currentMult ?? multiplierRef.current;
      const winAmount = Math.floor(bet * finalMult);
      setCashedOutAt(finalMult);
      setGameState("cashedout");
      toast.success(`✈️ Cashed out at ${finalMult}x! Won 🪙 ${winAmount}`);
      if (actor) {
        try {
          await actor.submitGameResult("AVIATOR", true, BigInt(winAmount));
        } catch {}
        try {
          const b = await actor.getBalance();
          setBalance(b);
        } catch {}
      }
    },
    [bet, actor, setBalance, stopInterval],
  );

  const startGame = useCallback(
    (cp: number) => {
      if (!isRegistered) {
        setShowRegisterModal(true);
        return;
      }
      if (balance < BigInt(bet)) {
        toast.error("Insufficient balance!");
        return;
      }
      setMultiplier(1.0);
      multiplierRef.current = 1.0;
      setCashedOutAt(0);
      setGameState("flying");

      intervalRef.current = setInterval(() => {
        multiplierRef.current = Number.parseFloat(
          (
            multiplierRef.current +
            0.03 +
            multiplierRef.current * 0.005
          ).toFixed(2),
        );
        setMultiplier(multiplierRef.current);
        const acVal = Number.parseFloat(autoCashout);
        if (autoCashout && acVal > 1 && multiplierRef.current >= acVal) {
          handleCashOut(multiplierRef.current);
          return;
        }
        if (multiplierRef.current >= cp) {
          stopInterval();
          setGameState("crashed");
          toast.error(`✈️ CRASHED at ${cp}x!`, { duration: 3000 });
        }
      }, 100);
    },
    [
      bet,
      balance,
      isRegistered,
      setShowRegisterModal,
      autoCashout,
      handleCashOut,
      stopInterval,
    ],
  );

  const handleStart = useCallback(() => {
    const cp = Number.parseFloat((1.1 + Math.random() * 18.9).toFixed(2));
    setCrashPoint(cp);
    startGame(cp);
  }, [startGame]);

  const handleCrashEnd = useCallback(async () => {
    if (actor) {
      try {
        await actor.submitGameResult("AVIATOR", false, BigInt(bet));
      } catch {}
      try {
        const b = await actor.getBalance();
        setBalance(b);
      } catch {}
    }
  }, [bet, actor, setBalance]);

  useEffect(() => {
    if (gameState === "crashed") {
      handleCrashEnd();
    }
    return stopInterval;
  }, [gameState, handleCrashEnd, stopInterval]);

  const accentColor = "oklch(0.6 0.3 335)";
  const isFlying = gameState === "flying";

  return (
    <GameLayout title="AVIATOR" emoji="✈️" accentColor={accentColor}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: "linear-gradient(135deg, #0a0520 0%, #150525 100%)",
            border: `2px solid ${accentColor}`,
            minHeight: "280px",
          }}
        >
          <div className="flex items-center justify-center h-64 relative overflow-hidden">
            <div className="absolute inset-0">
              {STARS.map((star) => (
                <div
                  key={star.id}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                  style={{ top: star.top, left: star.left }}
                />
              ))}
            </div>
            {gameState === "idle" && (
              <div className="text-center z-10">
                <div className="text-8xl mb-4">✈️</div>
                <p className="text-gray-400">Place your bet and start!</p>
              </div>
            )}
            {isFlying && (
              <div className="z-10 text-center">
                <motion.div
                  animate={{ x: [0, 20, -10, 30, 0], y: [0, -30, -10, -40, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="text-6xl mb-4"
                >
                  ✈️
                </motion.div>
                <motion.div
                  key={multiplier}
                  initial={{ scale: 1.2, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-black text-5xl"
                  style={{
                    color:
                      multiplier < 2
                        ? "white"
                        : multiplier < 5
                          ? "oklch(0.966 0.189 101.5)"
                          : accentColor,
                  }}
                >
                  {multiplier.toFixed(2)}x
                </motion.div>
              </div>
            )}
            {gameState === "crashed" && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="z-10 text-center"
              >
                <div className="text-6xl mb-3">💥</div>
                <div className="font-black text-4xl text-red-400">CRASHED!</div>
                <div className="text-gray-300 mt-2">at {crashPoint}x</div>
              </motion.div>
            )}
            {gameState === "cashedout" && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="z-10 text-center"
              >
                <div className="text-6xl mb-3">🎉</div>
                <div
                  className="font-black text-4xl"
                  style={{ color: "oklch(0.87 0.295 145)" }}
                >
                  CASHED OUT!
                </div>
                <div className="text-gray-300 mt-2">
                  at {cashedOutAt.toFixed(2)}x
                </div>
                <div
                  className="font-bold mt-1"
                  style={{ color: "oklch(0.87 0.295 145)" }}
                >
                  Won 🪙 {Math.floor(bet * cashedOutAt)}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "#1a1a1a", border: `2px solid ${accentColor}` }}
        >
          <div className="mb-4">
            <div className="text-gray-400 text-sm mb-2">Bet Amount</div>
            <div className="flex gap-2 flex-wrap">
              {BET_AMOUNTS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setBet(a)}
                  disabled={isFlying}
                  className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: bet === a ? accentColor : "#333",
                    color: bet === a ? "#000" : "#fff",
                    opacity: isFlying ? 0.5 : 1,
                  }}
                  data-ocid="aviator.bet.toggle"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="autocashout"
              className="text-gray-400 text-sm mb-2 block"
            >
              Auto Cash-out at (optional)
            </label>
            <input
              id="autocashout"
              type="number"
              value={autoCashout}
              onChange={(e) => setAutoCashout(e.target.value)}
              disabled={isFlying}
              placeholder="e.g. 2.5"
              className="w-full rounded-lg px-3 py-2 text-white text-sm"
              style={{ background: "#333", border: "1px solid #555" }}
              data-ocid="aviator.autocashout.input"
            />
          </div>
          {gameState === "idle" ||
          gameState === "crashed" ||
          gameState === "cashedout" ? (
            <Button
              onClick={handleStart}
              className="w-full font-black text-black text-lg py-3"
              style={{ backgroundColor: accentColor }}
              data-ocid="aviator.start.primary_button"
            >
              ✈️ {gameState === "idle" ? "START" : "PLAY AGAIN"} - Bet 🪙 {bet}
            </Button>
          ) : (
            <Button
              onClick={() => handleCashOut()}
              className="w-full font-black text-black text-lg py-3"
              style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
              data-ocid="aviator.cashout.primary_button"
            >
              💰 CASH OUT - 🪙 {Math.floor(bet * multiplier)}
            </Button>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
