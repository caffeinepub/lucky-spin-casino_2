import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RegisterModal from "./components/RegisterModal";
import { UserProvider } from "./context/UserContext";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import WalletPage from "./pages/WalletPage";
import AviatorGame from "./pages/games/AviatorGame";
import FortunesGemGame from "./pages/games/FortunesGemGame";
import KrakenGame from "./pages/games/KrakenGame";
import Lucky500Game from "./pages/games/Lucky500Game";
import MinesGame from "./pages/games/MinesGame";
import Slots777Game from "./pages/games/Slots777Game";

function RootLayout() {
  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col font-poppins">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <RegisterModal />
        <Toaster richColors position="top-right" />
      </div>
    </UserProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: GamesPage,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});
const minesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/mines",
  component: MinesGame,
});
const aviatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/aviator",
  component: AviatorGame,
});
const slots777Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/777slots",
  component: Slots777Game,
});
const lucky500Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/500lucky",
  component: Lucky500Game,
});
const fortunesGemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/fortunesgem",
  component: FortunesGemGame,
});
const krakenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games/kraken",
  component: KrakenGame,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  gamesRoute,
  leaderboardRoute,
  walletRoute,
  minesRoute,
  aviatorRoute,
  slots777Route,
  lucky500Route,
  fortunesGemRoute,
  krakenRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
