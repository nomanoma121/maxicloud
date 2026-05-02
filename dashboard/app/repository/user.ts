import type { UserAccount } from "~/types";
import { connectClient } from "~/utils/connect";

export interface IUserRepository {
  listUsers(): Promise<UserAccount[]>;
}

const fallbackUsers: UserAccount[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    displayId: "kouta",
    displayName: "Kouta (Demo)",
    email: "kouta@example.com",
    status: "active",
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
  status: "active",
  joinedAt: user.joinedAt || "-",
});

export class UserRepository implements IUserRepository {
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
