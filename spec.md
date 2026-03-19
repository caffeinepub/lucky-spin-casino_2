# Lucky Spin Casino

## Current State
New project. No existing application.

## Requested Changes (Diff)

### Add
- Full casino gaming platform with 6 games: Mines, Aviator, 777 Slots, 500 Lucky Slot, Fortunes Gem 500, Power of Kraken
- Virtual coin wallet system (not real money)
- User registration with phone number (earns bonus coins)
- Player profile with balance display
- Deposit request flow (in-app, not real money)
- Live winners feed / jackpot display
- Game lobby with featured game cards

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- User profile: username, phone number, coin balance
- Wallet: get balance, add coins (demo/virtual), transaction history
- Game results: record win/loss, update balance
- Leaderboard: top winners
- Deposit request: store request (in-app only, no external integration)

### Frontend
- Home/Lobby page with hero section, featured game grid, live winners strip
- Individual game screens:
  1. **Mines** - grid of tiles, pick safe squares, avoid bombs
  2. **Aviator** - multiplier crash game, cash out before plane flies away
  3. **777 Slots** - classic 3-reel slot machine
  4. **500 Lucky Slot** - 5-reel slot with lucky symbols
  5. **Fortunes Gem 500** - gem-themed slot with cascading wins
  6. **Power of Kraken** - underwater themed slot with kraken wilds
- Wallet/balance widget in header
- Phone number registration for bonus coins
- Deposit request modal (in-app)
- Responsive layout
