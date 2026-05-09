import { USER_STATUS, type ValueOf } from "~/constants";
import { connectClient } from "~/utils/connect";

export type UserStatus = ValueOf<typeof USER_STATUS>;

export type UserAccount = {
	id: string;
	displayId: string;
	displayName: string;
	email: string;
	status: UserStatus;
	joinedAt: string;
};

export interface IUserRepository {
	listUsers$$key(): readonly ["users"];
	listUsers(): Promise<UserAccount[]>;
}

// TODO: この辺全然適当なんでIdP連携の時にちゃんとやりましょう
const fallbackUsers: UserAccount[] = [
	{
		id: "00000000-0000-0000-0000-000000000001",
		displayId: "Maximum-test",
		displayName: "Maximum-Test",
		email: "test@maximum.vc",
		status: USER_STATUS.ACTIVE,
		joinedAt: "-",
	},
];

const toUser = (user: {
	id: string;
	displayId: string;
	displayName: string;
	email: string;
	joinedAt: string;
}): UserAccount => ({
	id: user.id,
	displayId: user.displayId,
	displayName: user.displayName,
	email: user.email,
	status: USER_STATUS.ACTIVE,
	joinedAt: user.joinedAt || "-",
});

export class UserRepository implements IUserRepository {
	listUsers$$key() {
		return ["users"] as const;
	}

	async listUsers(): Promise<UserAccount[]> {
		try {
			const res = await connectClient.auth.getCurrentUser({});
			if (!res.user) {
				return fallbackUsers;
			}
			return [toUser(res.user)];
		} catch {
			return fallbackUsers;
		}
	}
}
