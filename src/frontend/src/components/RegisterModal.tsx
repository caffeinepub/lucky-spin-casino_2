import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { useActor } from "../hooks/useActor";

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
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setError("");
    try {
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
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
      <DialogContent
        className="border-2 text-white max-w-md"
        style={{ background: "#111", borderColor: "oklch(0.87 0.295 145)" }}
        data-ocid="register.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            <span style={{ color: "oklch(0.966 0.189 101.5)" }}>
              🎰 JOIN LUCKY SPIN
            </span>
          </DialogTitle>
          <p className="text-center text-gray-400 text-sm">
            Register now and get 1000 bonus coins!
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
            <Label className="text-gray-300 font-semibold">Phone Number</Label>
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
            style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
            data-ocid="register.submit_button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              "🎮 START PLAYING"
            )}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Virtual coins only. Not real money. 18+ only.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
