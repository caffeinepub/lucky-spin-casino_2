import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Profile } from "../backend";
import { useActor } from "../hooks/useActor";

interface UserContextType {
  username: string;
  balance: bigint;
  isRegistered: boolean;
  isLoadingSession: boolean;
  phone: string;
  setUsername: (u: string) => void;
  setBalance: (b: bigint) => void;
  setIsRegistered: (r: boolean) => void;
  setPhone: (p: string) => void;
  refreshBalance: () => Promise<void>;
  showRegisterModal: boolean;
  setShowRegisterModal: (s: boolean) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState<bigint>(0n);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [phone, setPhone] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { actor, isFetching } = useActor();

  const refreshBalance = useCallback(async () => {
    if (!actor) return;
    try {
      const bal = await actor.getBalance();
      setBalance(bal);
    } catch {
      // ignore
    }
  }, [actor]);

  // Restore session or prompt registration when actor is ready
  useEffect(() => {
    if (!actor || isFetching) return;

    let cancelled = false;
    (async () => {
      setIsLoadingSession(true);
      try {
        const profile: Profile | null = await (actor as any).getMyProfile();
        if (cancelled) return;
        if (profile) {
          setUsername(profile.username);
          setPhone(profile.phone);
          setBalance(profile.balance);
          setIsRegistered(true);
          setShowRegisterModal(false);
        } else {
          setShowRegisterModal(true);
        }
      } catch {
        if (!cancelled) setShowRegisterModal(true);
      } finally {
        if (!cancelled) setIsLoadingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [actor, isFetching]);

  // Periodic balance refresh (only when registered)
  useEffect(() => {
    if (!actor || !isRegistered) return;
    const interval = setInterval(refreshBalance, 10000);
    return () => clearInterval(interval);
  }, [actor, isRegistered, refreshBalance]);

  return (
    <UserContext.Provider
      value={{
        username,
        balance,
        isRegistered,
        isLoadingSession,
        phone,
        setUsername,
        setBalance,
        setIsRegistered,
        setPhone,
        refreshBalance,
        showRegisterModal,
        setShowRegisterModal,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
