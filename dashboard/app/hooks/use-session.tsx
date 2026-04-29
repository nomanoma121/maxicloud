import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserAccount } from "~/types";
import { useRepository } from "./use-repository";

const STORAGE_KEY = "maxicloud-session-v1";

type SessionState = {
  userId: string;
};

type SessionContextValue = {
  isReady: boolean;
  isLoggedIn: boolean;
  users: UserAccount[];
  currentUser: UserAccount | null;
  loginAs: (userId: string) => void;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { userRepository } = useRepository();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const nextUsers = await userRepository.listUsers();
      if (cancelled) {
        return;
      }
      setUsers(nextUsers);

      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as SessionState;
          if (parsed?.userId) {
            setSession(parsed);
          }
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      setIsReady(true);
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [userRepository]);

  const loginAs = useCallback((userId: string) => {
    const next = { userId } satisfies SessionState;
    setSession(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentUser = useMemo(() => {
    if (!session) return null;
    return users.find((user) => user.id === session.userId) ?? null;
  }, [session, users]);

  const value = useMemo(
    () => ({
      isReady,
      isLoggedIn: !!currentUser,
      users,
      currentUser,
      loginAs,
      logout,
    }),
    [currentUser, isReady, loginAs, logout, users],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
};
