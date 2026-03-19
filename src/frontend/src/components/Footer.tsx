export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="bg-[#0a0a0a] border-t-2"
      style={{ borderColor: "oklch(0.25 0 0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎰</span>
              <span className="font-black text-lg text-white">
                LUCKY SPIN CASINO
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Your premier virtual casino experience. Play responsibly.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              🔞 18+ | Virtual coins only. Not real money.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">
              Games
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mines</li>
              <li>Aviator</li>
              <li>777 Slots</li>
              <li>500 Lucky Slot</li>
              <li>Fortunes Gem 500</li>
              <li>Power of Kraken</li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              {["💳 UPI", "📱 PhonePe", "💰 GPay", "🏦 Bank"].map((p) => (
                <span
                  key={p}
                  className="bg-gray-800 text-gray-300 rounded px-2 py-1 text-xs"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              For deposit requests, contact our team.
            </p>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">
              Social
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>💬 WhatsApp: 9149613487</div>
              <div>📧 Support: 24/7 Available</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {year}. Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.87_0.295_145)] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-gray-600 text-xs">
            🔒 Licensed & Regulated | Play Responsibly | Virtual Coins Only
          </p>
        </div>
      </div>
    </footer>
  );
}
