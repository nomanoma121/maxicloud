import { connectClient } from "~/utils/connect";
import { USER_STATUS, type ValueOf } from "~/constants";

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

const fallbackUsers: UserAccount[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    displayId: "kouta",
    displayName: "Kouta (Demo)",
    email: "kouta@example.com",
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
