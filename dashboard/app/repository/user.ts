import type { UserAccount } from "~/types";
import { state } from "~/repository/shared/state";

export interface IUserRepository {
  listUsers(): Promise<UserAccount[]>;
}

export class UserRepository implements IUserRepository {
  async listUsers(): Promise<UserAccount[]> {
    return state.users.map((item) => ({ ...item }));
  }
}
