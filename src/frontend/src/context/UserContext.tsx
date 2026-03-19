import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";

interface UserContextType {
  username: string;
  balance: bigint;
  isRegistered: boolean;
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
  const [phone, setPhone] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { actor } = useActor();

  const refreshBalance = useCallback(async () => {
    if (!actor) return;
    try {
      const bal = await actor.getBalance();
      setBalance(bal);
    } catch {
      // ignore
    }
  }, [actor]);

  useEffect(() => {
    if (!actor) return;
    refreshBalance();
    const interval = setInterval(refreshBalance, 10000);
    return () => clearInterval(interval);
  }, [actor, refreshBalance]);

  return (
    <UserContext.Provider
      value={{
        username,
        balance,
        isRegistered,
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
