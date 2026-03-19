import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, History, Loader2, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { useActor } from "../hooks/useActor";
import { useTransactions } from "../hooks/useQueries";

const ADD_AMOUNTS = [500, 1000, 2000, 5000, 10000, 50000];
const WHATSAPP_NUMBER = "919149613487";
const UPI_ID = "9149613487@fam";

export default function WalletPage() {
  const {
    balance,
    setBalance,
    username,
    phone,
    isRegistered,
    setShowRegisterModal,
  } = useUser();
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

  // UPI deposit state
  const [utrNumber, setUtrNumber] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [upiPhone, setUpiPhone] = useState("");

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState(phone || "");
  const [withdrawUpi, setWithdrawUpi] = useState("");

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

  const handleUpiDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      toast.error("Enter UTR number");
      return;
    }
    if (!upiAmount || Number(upiAmount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    if (!upiPhone.trim()) {
      toast.error("Enter your WhatsApp number");
      return;
    }
    const msg = `UTR: ${utrNumber} Amount: ${upiAmount} WhatsApp: ${upiPhone} | Add Money Request Lucky Spin Casino`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp to send deposit request!");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) < 500) {
      toast.error("Minimum withdraw is 500 coins");
      return;
    }
    if (!withdrawPhone.trim()) {
      toast.error("Enter your WhatsApp number");
      return;
    }
    if (!withdrawUpi.trim()) {
      toast.error("Enter your UPI ID");
      return;
    }
    const msg = `WITHDRAW REQUEST: Amount: ${withdrawAmount} UPI: ${withdrawUpi} WhatsApp: ${withdrawPhone} | Lucky Spin Casino`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Opening WhatsApp to send withdraw request!");
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
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

        {/* UPI Deposit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "#111",
            border: "2px solid oklch(0.82 0.19 80)",
            boxShadow: "0 0 30px oklch(0.82 0.19 80 / 0.25)",
          }}
        >
          <h2 className="font-black text-white text-xl mb-5 flex items-center gap-2">
            <span style={{ color: "oklch(0.82 0.19 80)" }}>💳</span> Add Money
            via UPI
          </h2>

          {/* QR Code + UPI ID */}
          <div className="flex flex-col md:flex-row gap-6 mb-6 items-center md:items-start">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/assets/uploads/IMG-20251213-WA0003-1.jpg"
                alt="UPI QR Code"
                className="rounded-xl object-contain"
                style={{
                  maxWidth: 220,
                  width: "100%",
                  border: "3px solid oklch(0.82 0.19 80)",
                  boxShadow: "0 0 20px oklch(0.82 0.19 80 / 0.4)",
                }}
              />
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid oklch(0.82 0.19 80 / 0.5)",
                }}
              >
                <span className="text-white font-mono font-bold text-sm">
                  {UPI_ID}
                </span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="text-gray-400 hover:text-white transition-colors"
                  data-ocid="wallet.toggle"
                  title="Copy UPI ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: "#0a0a0a",
                  border: "1px solid oklch(0.82 0.19 80 / 0.3)",
                }}
              >
                <p className="text-gray-300 text-sm font-semibold mb-2">
                  How to deposit:
                </p>
                <ol className="text-gray-400 text-sm space-y-1 list-none">
                  <li>1️⃣ Scan QR or use UPI ID above</li>
                  <li>2️⃣ Pay your desired amount</li>
                  <li>3️⃣ Copy the UTR / Transaction Reference Number</li>
                  <li>4️⃣ Fill the form below &amp; Submit to confirm</li>
                </ol>
              </div>
              <form onSubmit={handleUpiDeposit} className="space-y-3">
                <div>
                  <Label className="text-gray-300 text-sm">
                    UTR / Transaction Reference Number *
                  </Label>
                  <Input
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="Enter UTR number from your UPI app"
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                    data-ocid="wallet.utr.input"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">
                    Amount Paid (₹) *
                  </Label>
                  <Input
                    value={upiAmount}
                    onChange={(e) =>
                      setUpiAmount(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="e.g. 500"
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                    data-ocid="wallet.upi_amount.input"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm">
                    Your WhatsApp Number *
                  </Label>
                  <Input
                    value={upiPhone}
                    onChange={(e) => setUpiPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="bg-gray-900 border-gray-600 text-white mt-1"
                    data-ocid="wallet.upi_phone.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-black text-black"
                  style={{ backgroundColor: "oklch(0.82 0.19 80)" }}
                  data-ocid="wallet.upi_deposit.submit_button"
                >
                  📲 Send via WhatsApp to Confirm
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Withdraw Request Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-6 mb-8"
          style={{
            background: "#111",
            border: "2px solid oklch(0.6 0.3 335)",
            boxShadow: "0 0 30px oklch(0.6 0.3 335 / 0.2)",
          }}
        >
          <h2 className="font-black text-white text-xl mb-2 flex items-center gap-2">
            <span style={{ color: "oklch(0.7 0.3 335)" }}>💸</span> Withdraw
            Request
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            ⚠️ Minimum withdraw:{" "}
            <span className="font-bold text-white">500 coins</span>
          </p>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <Label className="text-gray-300">Withdraw Amount (coins) *</Label>
              <Input
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(e.target.value.replace(/\D/g, ""))
                }
                placeholder="Min 500 coins"
                className="bg-gray-900 border-gray-600 text-white mt-1"
                data-ocid="wallet.withdraw_amount.input"
              />
            </div>
            <div>
              <Label className="text-gray-300">Your WhatsApp Number *</Label>
              <Input
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="bg-gray-900 border-gray-600 text-white mt-1"
                data-ocid="wallet.withdraw_phone.input"
              />
            </div>
            <div>
              <Label className="text-gray-300">Your UPI ID *</Label>
              <Input
                value={withdrawUpi}
                onChange={(e) => setWithdrawUpi(e.target.value)}
                placeholder="e.g. yourname@upi"
                className="bg-gray-900 border-gray-600 text-white mt-1"
                data-ocid="wallet.withdraw_upi.input"
              />
            </div>
            <Button
              type="submit"
              className="w-full font-black text-white"
              style={{ backgroundColor: "oklch(0.55 0.28 335)" }}
              data-ocid="wallet.withdraw.submit_button"
            >
              📲 Send Withdraw Request via WhatsApp
            </Button>
            <p className="text-gray-500 text-xs text-center">
              ⏰ Our team will process your request within 24 hours.
            </p>
          </form>
        </motion.div>

        {/* Old deposit request section */}
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

        {/* Transaction History */}
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
