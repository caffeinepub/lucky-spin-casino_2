import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Loader2, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { useActor } from "../hooks/useActor";
import { useTransactions } from "../hooks/useQueries";

const ADD_AMOUNTS = [500, 1000, 2000, 5000, 10000, 50000];

export default function WalletPage() {
  const { balance, setBalance, username, isRegistered, setShowRegisterModal } =
    useUser();
  const { actor } = useActor();
  const {
    data: transactions,
    isLoading: txLoading,
    refetch,
  } = useTransactions();
  const [addingCoins, setAddingCoins] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositContact, setDepositContact] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  const handleAddCoins = async (amount: number) => {
    if (!actor) return;
    if (!isRegistered) {
      setShowRegisterModal(true);
      return;
    }
    setAddingCoins(true);
    try {
      await actor.addCoins(BigInt(amount));
      const bal = await actor.getBalance();
      setBalance(bal);
      toast.success(`🪙 Added ${amount} coins!`);
      refetch();
    } catch {
      toast.error("Failed to add coins");
    } finally {
      setAddingCoins(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (!depositAmount || Number(depositAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!depositContact.trim()) {
      toast.error("Enter contact info");
      return;
    }
    setDepositLoading(true);
    try {
      await actor.requestDeposit(BigInt(depositAmount), depositContact.trim());
      setDepositSuccess(true);
      setDepositAmount("");
      setDepositContact("");
      toast.success("📨 Deposit request submitted!");
    } catch {
      toast.error("Failed to submit deposit request");
    } finally {
      setDepositLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "oklch(0.966 0.189 101.5)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black uppercase text-black">
            💰 WALLET
          </h1>
          <div
            className="w-24 h-1 mx-auto mt-3 rounded-full"
            style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
          />
        </motion.div>
        {!isRegistered && (
          <div
            className="rounded-2xl p-6 mb-8 text-center"
            style={{
              background: "#111",
              border: "2px solid oklch(0.87 0.295 145)",
            }}
          >
            <p className="text-white font-bold mb-3">
              Register to save your wallet!
            </p>
            <Button
              onClick={() => setShowRegisterModal(true)}
              className="text-black font-bold"
              style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
              data-ocid="wallet.register.button"
            >
              Register Now
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            className="rounded-2xl p-6"
            style={{
              background: "#111",
              border: "2px solid oklch(0.87 0.295 145)",
              boxShadow: "0 0 30px oklch(0.87 0.295 145 / 0.3)",
            }}
          >
            <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">
              Current Balance
            </div>
            <div
              className="text-4xl font-black mb-1"
              style={{ color: "oklch(0.87 0.295 145)" }}
            >
              🪙 {Number(balance).toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm">virtual coins</div>
            {username && (
              <div className="mt-3 text-white font-semibold">👤 {username}</div>
            )}
          </div>
          <div
            className="rounded-2xl p-6"
            style={{ background: "#111", border: "2px solid oklch(0.3 0 0)" }}
          >
            <div className="text-white font-bold mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Virtual Coins
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ADD_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  onClick={() => handleAddCoins(amt)}
                  disabled={addingCoins}
                  className="text-xs font-bold text-black"
                  style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
                  data-ocid="wallet.add_button"
                >
                  {addingCoins ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    `+${amt >= 1000 ? `${amt / 1000}k` : amt}`
                  )}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ⚠️ Virtual coins only. Not real money.
            </p>
          </div>
        </div>
        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "#111",
            border: "2px solid oklch(0.82 0.19 80 / 0.5)",
          }}
        >
          <h2 className="font-black text-white text-xl mb-4 flex items-center gap-2">
            <Send
              className="w-5 h-5"
              style={{ color: "oklch(0.82 0.19 80)" }}
            />{" "}
            Deposit Request
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Our team will contact you via WhatsApp:{" "}
            <span className="font-bold text-white">9149613487</span>
          </p>
          {depositSuccess ? (
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "oklch(0.15 0.05 145)",
                border: "1px solid oklch(0.87 0.295 145)",
              }}
              data-ocid="wallet.success_state"
            >
              <div className="text-4xl mb-2">✅</div>
              <div className="font-bold text-white">
                Deposit Request Submitted!
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Our team will contact you on WhatsApp shortly.
              </div>
              <Button
                onClick={() => setDepositSuccess(false)}
                className="mt-3 text-black text-sm"
                style={{ backgroundColor: "oklch(0.87 0.295 145)" }}
              >
                New Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <Label className="text-gray-300">Amount (virtual coins)</Label>
                <Input
                  value={depositAmount}
                  onChange={(e) =>
                    setDepositAmount(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="e.g. 5000"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  data-ocid="wallet.deposit.input"
                />
              </div>
              <div>
                <Label className="text-gray-300">
                  Contact Info (WhatsApp / Phone)
                </Label>
                <Input
                  value={depositContact}
                  onChange={(e) => setDepositContact(e.target.value)}
                  placeholder="Your WhatsApp number"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  data-ocid="wallet.contact.input"
                />
              </div>
              <Button
                type="submit"
                disabled={depositLoading}
                className="w-full text-black font-bold"
                style={{ backgroundColor: "oklch(0.82 0.19 80)" }}
                data-ocid="wallet.deposit.submit_button"
              >
                {depositLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                    Submitting...
                  </>
                ) : (
                  "📨 Submit Deposit Request"
                )}
              </Button>
            </form>
          )}
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#111", border: "2px solid oklch(0.25 0 0)" }}
        >
          <div className="p-4 border-b border-gray-800">
            <h2 className="font-black text-white flex items-center gap-2">
              <History className="w-4 h-4" /> Transaction History
            </h2>
          </div>
          {txLoading ? (
            <div className="p-4 space-y-3" data-ocid="wallet.loading_state">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 bg-gray-800" />
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="divide-y divide-gray-800" data-ocid="wallet.table">
              {transactions.map((tx, i) => (
                <div
                  key={`tx-${tx.timestamp}-${i}`}
                  className="px-4 py-3 flex items-center justify-between"
                  data-ocid={`wallet.item.${i + 1}`}
                >
                  <div>
                    <div className="text-white text-sm font-semibold">
                      {tx.description}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(
                        Number(tx.timestamp) / 1000000,
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${Number(tx.amount) >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {Number(tx.amount) >= 0 ? "+" : ""}
                      {Number(tx.amount).toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-xs">
                      🪙 {Number(tx.balanceAfter).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center" data-ocid="wallet.empty_state">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-gray-400">
                No transactions yet. Start playing!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
