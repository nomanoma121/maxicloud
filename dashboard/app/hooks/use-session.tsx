import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { USER_STATUS } from "~/constants";
import type { UserAccount } from "~/repository/user";
import { useRepository } from "./use-repository";

const STORAGE_KEY = "maxicloud-session-v1";

type SessionState = {
	userId: string;
};

const isSessionState = (value: unknown): value is SessionState => {
	if (typeof value !== "object" || value === null) return false;
	if (!("userId" in value)) return false;
	return typeof value.userId === "string" && value.userId.length > 0;
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

export const SessionProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
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
			let nextSession: SessionState | null = null;

			if (raw) {
				try {
					const parsed: unknown = JSON.parse(raw);
					if (isSessionState(parsed)) {
						nextSession = parsed;
					}
				} catch {
					window.localStorage.removeItem(STORAGE_KEY);
				}
			}

			if (!nextSession) {
				const fallbackUser =
					nextUsers.find((user) => user.status === USER_STATUS.ACTIVE) ??
					nextUsers[0];
				if (fallbackUser) {
					nextSession = { userId: fallbackUser.id };
					window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
				}
			}

			setSession(nextSession);

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

	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within SessionProvider");
	}
	return context;
};
