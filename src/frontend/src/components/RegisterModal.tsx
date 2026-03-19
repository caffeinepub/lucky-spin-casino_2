import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Profile } from "../backend";
import { useUser } from "../context/UserContext";
import { useActor } from "../hooks/useActor";

const NEON_GREEN = "oklch(0.87 0.295 145)";
const NEON_YELLOW = "oklch(0.966 0.189 101.5)";

type Tab = "register" | "login";

export default function RegisterModal() {
  const {
    showRegisterModal,
    setShowRegisterModal,
    setUsername,
    setBalance,
    setIsRegistered,
    setPhone,
  } = useUser();
  const { actor } = useActor();
  const [tab, setTab] = useState<Tab>("register");
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const restoreSession = async () => {
    if (!actor) throw new Error("Connecting to backend...");
    const profile: Profile | null = await (actor as any).getMyProfile();
    if (!profile)
      throw new Error("No account found for your Internet Identity.");
    setUsername(profile.username);
    setPhone(profile.phone);
    setBalance(profile.balance);
    setIsRegistered(true);
    setShowRegisterModal(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || name.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!/^\d{10}$/.test(phoneNum)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (!actor) {
      setError("Connecting to backend...");
      return;
    }
    setLoading(true);
    try {
      // Check if already registered first
      const existing: Profile | null = await (actor as any).getMyProfile();
      if (existing) {
        setUsername(existing.username);
        setPhone(existing.phone);
        setBalance(existing.balance);
        setIsRegistered(true);
        setShowRegisterModal(false);
        toast.success(`🎉 Welcome back, ${existing.username}!`, {
          duration: 4000,
        });
        return;
      }
      // New registration
      await actor.register(name.trim(), phoneNum);
      await actor.addCoins(1000n);
      const bal = await actor.getBalance();
      setUsername(name.trim());
      setPhone(phoneNum);
      setBalance(bal);
      setIsRegistered(true);
      setShowRegisterModal(false);
      toast.success("🎉 Welcome! 1000 bonus coins added!", { duration: 5000 });
    } catch (err: any) {
      const msg: string = err?.message || "";
      if (msg.toLowerCase().includes("already registered")) {
        try {
          await restoreSession();
          toast.success("🎉 Welcome back!", { duration: 4000 });
        } catch {
          setError(
            "Account exists. Please use the 'Returning Player' tab to log in.",
          );
        }
      } else {
        setError(msg || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!actor) {
      setError("Connecting to backend...");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await restoreSession();
      toast.success("🎉 Welcome back!", { duration: 4000 });
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
      <DialogContent
        className="border-2 text-white max-w-md"
        style={{ background: "#111", borderColor: NEON_GREEN }}
        data-ocid="register.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            <span style={{ color: NEON_YELLOW }}>🎰 LUCKY SPIN CASINO</span>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div
          className="flex rounded-lg overflow-hidden border mt-1"
          style={{ borderColor: "#333" }}
        >
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError("");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-all"
            style={{
              background: tab === "register" ? NEON_GREEN : "#1a1a1a",
              color: tab === "register" ? "#000" : "#aaa",
            }}
            data-ocid="register.tab"
          >
            <UserPlus className="w-4 h-4" /> New Player
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-all"
            style={{
              background: tab === "login" ? NEON_GREEN : "#1a1a1a",
              color: tab === "login" ? "#000" : "#aaa",
            }}
            data-ocid="login.tab"
          >
            <LogIn className="w-4 h-4" /> Returning Player
          </button>
        </div>

        {tab === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4 mt-2">
            <p className="text-center text-gray-400 text-sm">
              Create your account and get{" "}
              <span style={{ color: NEON_GREEN }} className="font-bold">
                1000 bonus coins
              </span>
              !
            </p>
            <div>
              <Label className="text-gray-300 font-semibold">Username</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username..."
                className="bg-gray-900 border-gray-600 text-white mt-1"
                data-ocid="register.input"
                maxLength={20}
              />
            </div>
            <div>
              <Label className="text-gray-300 font-semibold">
                Phone Number
              </Label>
              <Input
                value={phoneNum}
                onChange={(e) =>
                  setPhoneNum(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit phone number"
                className="bg-gray-900 border-gray-600 text-white mt-1"
                data-ocid="register.phone.input"
                type="tel"
              />
            </div>

            {error && (
              <p
                className="text-red-400 text-sm"
                data-ocid="register.error_state"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-black text-lg text-black py-3"
              style={{ backgroundColor: NEON_GREEN }}
              data-ocid="register.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Registering...
                </>
              ) : (
                "🎮 START PLAYING"
              )}
            </Button>
            <p className="text-center text-xs text-gray-500">
              Virtual coins only. Not real money. 18+ only.
            </p>
          </form>
        ) : (
          <div className="space-y-4 mt-2">
            <div
              className="rounded-lg p-4 border text-center"
              style={{ background: "#1a2a1a", borderColor: "#2a4a2a" }}
            >
              <p className="text-gray-300 text-sm leading-relaxed">
                Welcome back! 👋
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Your account is linked to your Internet Identity. Click{" "}
                <strong style={{ color: NEON_GREEN }}>Login</strong> to restore
                your session.
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-sm" data-ocid="login.error_state">
                {error}
              </p>
            )}

            <Button
              type="button"
              disabled={loading}
              onClick={handleLogin}
              className="w-full font-black text-lg text-black py-3"
              style={{ backgroundColor: NEON_GREEN }}
              data-ocid="login.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "🔑 LOGIN"
              )}
            </Button>
            <p className="text-center text-xs text-gray-500">
              Don't have an account? Switch to the New Player tab.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
