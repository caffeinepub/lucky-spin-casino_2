import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import GameLayout from "../../components/GameLayout";
import { useUser } from "../../context/UserContext";
import { useActor } from "../../hooks/useActor";

type TileState = "hidden" | "diamond" | "bomb";

const BET_AMOUNTS = [10, 50, 100, 500, 1000];
const GRID_SIZE = 25;
const TILE_KEYS = Array.from(
  { length: GRID_SIZE },
  (_, i) => `tile-r${Math.floor(i / 5)}-c${i % 5}`,
);

function getMineMultiplier(revealed: number, totalMines: number): number {
  let mult = 1;
  for (let i = 0; i < revealed; i++) {
    mult *= (GRID_SIZE - totalMines - i) / (GRID_SIZE - i);
  }
  return Math.max(1, 1 / mult);
}

function generateMines(count: number): Set<number> {
  const mines = new Set<number>();
  while (mines.size < count) {
    mines.add(Math.floor(Math.random() * GRID_SIZE));
  }
  return mines;
}

export default function MinesGame() {
  const { balance, setBalance, isRegistered, setShowRegisterModal } = useUser();
  const { actor } = useActor();
  const [bet, setBet] = useState(100);
  const [mineCount, setMineCount] = useState(5);
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");
  const [tiles, setTiles] = useState<TileState[]>(
    Array(GRID_SIZE).fill("hidden"),
  );
  const [mines, setMines] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const startGame = useCallback(() => {
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    if (balance < BigInt(bet)) {
      toast.error("Insufficient balance!");
      return;
    }
    const newMines = generateMines(mineCount);
    setMines(newMines);
    setTiles(Array(GRID_SIZE).fill("hidden"));
    setRevealed(0);
    setMultiplier(1);
    setGameState("playing");
  }, [bet, mineCount, balance, isRegistered, setShowRegisterModal]);

  const cashOut = useCallback(
    async (mult?: number, auto?: boolean) => {
      if (gameState !== "playing" && !auto) return;
      const finalMult = mult ?? multiplier;
      const winAmount = Math.floor(bet * finalMult);
      setGameState("won");
      toast.success(`💎 Cashed out! Won 🪙 ${winAmount}`, { duration: 4000 });
      if (actor) {
        try {
          await actor.submitGameResult("MINES", true, BigInt(winAmount));
        } catch {}
        try {
          const b = await actor.getBalance();
          setBalance(b);
        } catch {}
      }
    },
    [gameState, multiplier, bet, actor, setBalance],
  );

  const clickTile = useCallback(
    async (index: number) => {
      if (gameState !== "playing") return;
      if (tiles[index] !== "hidden") return;
      const newTiles = [...tiles];
      if (mines.has(index)) {
        for (const m of mines) {
          newTiles[m] = "bomb";
        }
        newTiles[index] = "bomb";
        setTiles(newTiles);
        setGameState("lost");
        toast.error("💣 BOOM! You hit a mine!", { duration: 3000 });
        if (actor) {
          try {
            await actor.submitGameResult("MINES", false, BigInt(bet));
          } catch {}
          try {
            const b = await actor.getBalance();
            setBalance(b);
          } catch {}
        }
      } else {
        newTiles[index] = "diamond";
        setTiles(newTiles);
        const newRevealed = revealed + 1;
        setRevealed(newRevealed);
        const newMult = getMineMultiplier(newRevealed, mineCount);
        setMultiplier(Number.parseFloat(newMult.toFixed(2)));
        if (newRevealed >= GRID_SIZE - mineCount) {
          await cashOut(newMult, true);
        }
      }
    },
    [
      gameState,
      tiles,
      mines,
      revealed,
      mineCount,
      bet,
      actor,
      setBalance,
      cashOut,
    ],
  );

  const accentColor = "oklch(0.85 0.18 200)";

  return (
    <GameLayout title="MINES" emoji="💣" accentColor={accentColor}>
      <div className="max-w-2xl mx-auto">
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "#1a1a1a",
              border: `2px solid ${accentColor}`,
            }}
          >
            <h2 className="font-black text-white text-xl mb-4">
              Game Settings
            </h2>
            <div className="mb-4">
              <div className="text-gray-400 text-sm mb-2">Bet Amount</div>
              <div className="flex gap-2 flex-wrap">
                {BET_AMOUNTS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setBet(a)}
                    className="px-4 py-2 rounded-lg font-bold text-sm transition-all"
                    style={{
                      background: bet === a ? accentColor : "#333",
                      color: bet === a ? "#000" : "#fff",
                    }}
                    data-ocid="mines.bet.toggle"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="mine-range"
                className="text-gray-400 text-sm mb-2 block"
              >
                Number of Mines:{" "}
                <span className="text-white font-bold">{mineCount}</span>
              </label>
              <input
                id="mine-range"
                type="range"
                min="3"
                max="10"
                value={mineCount}
                onChange={(e) => setMineCount(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3 (easy)</span>
                <span>10 (risky)</span>
              </div>
            </div>
            <Button
              onClick={startGame}
              className="w-full font-black text-black text-lg py-3"
              style={{ backgroundColor: accentColor }}
              data-ocid="mines.play.primary_button"
            >
              💣 START GAME - Bet 🪙 {bet}
            </Button>
          </motion.div>
        )}

        {gameState !== "idle" && (
          <div
            className="mb-4 flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: "#1a1a1a",
              border: `1px solid ${accentColor}`,
            }}
          >
            <div>
              <div className="text-xs text-gray-400">BET</div>
              <div className="font-bold text-white">🪙 {bet}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">MULTIPLIER</div>
              <div
                className="font-black text-2xl"
                style={{ color: accentColor }}
              >
                {multiplier}x
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">POTENTIAL WIN</div>
              <div className="font-bold" style={{ color: accentColor }}>
                🪙 {Math.floor(bet * multiplier)}
              </div>
            </div>
          </div>
        )}

        {gameState !== "idle" && (
          <div className="grid grid-cols-5 gap-2 mb-4">
            {tiles.map((tile, i) => (
              <motion.button
                key={TILE_KEYS[i]}
                type="button"
                onClick={() => clickTile(i)}
                disabled={gameState !== "playing" || tile !== "hidden"}
                whileHover={
                  gameState === "playing" && tile === "hidden"
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  gameState === "playing" && tile === "hidden"
                    ? { scale: 0.95 }
                    : {}
                }
                animate={tile !== "hidden" ? { scale: [1.2, 1] } : {}}
                className="aspect-square rounded-xl flex items-center justify-center text-2xl font-bold transition-all"
                style={{
                  background:
                    tile === "diamond"
                      ? "oklch(0.15 0.08 200)"
                      : tile === "bomb"
                        ? "oklch(0.15 0.08 25)"
                        : "#2a2a2a",
                  border: `2px solid ${tile === "diamond" ? accentColor : tile === "bomb" ? "oklch(0.6 0.28 25)" : "#444"}`,
                  cursor:
                    gameState === "playing" && tile === "hidden"
                      ? "pointer"
                      : "default",
                }}
                data-ocid="mines.canvas_target"
              >
                {tile === "diamond"
                  ? "💎"
                  : tile === "bomb"
                    ? "💣"
                    : gameState !== "playing"
                      ? ""
                      : "🔳"}
              </motion.button>
            ))}
          </div>
        )}

        {gameState === "playing" && (
          <Button
            onClick={() => cashOut()}
            className="w-full font-black text-black text-lg py-3 mb-4"
            style={{ backgroundColor: accentColor }}
            data-ocid="mines.cashout.primary_button"
          >
            💰 CASH OUT - 🪙 {Math.floor(bet * multiplier)}
          </Button>
        )}

        {(gameState === "won" || gameState === "lost") && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-6 text-center mb-4"
              style={{
                background:
                  gameState === "won"
                    ? "oklch(0.15 0.08 145)"
                    : "oklch(0.15 0.08 25)",
                border: `2px solid ${gameState === "won" ? "oklch(0.87 0.295 145)" : "oklch(0.6 0.28 25)"}`,
              }}
              data-ocid={
                gameState === "won"
                  ? "mines.success_state"
                  : "mines.error_state"
              }
            >
              <div className="text-5xl mb-2">
                {gameState === "won" ? "🎉" : "💥"}
              </div>
              <div className="font-black text-2xl text-white">
                {gameState === "won" ? "YOU WON!" : "BOOM!"}
              </div>
              <div className="text-gray-300 mt-1">
                {gameState === "won"
                  ? `Won 🪙 ${Math.floor(bet * multiplier)}`
                  : `Lost 🪙 ${bet}`}
              </div>
              <Button
                onClick={() => setGameState("idle")}
                className="mt-4 font-bold text-black"
                style={{ backgroundColor: accentColor }}
                data-ocid="mines.play.primary_button"
              >
                Play Again
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </GameLayout>
  );
}
