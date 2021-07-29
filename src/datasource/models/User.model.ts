import Knex from "knex";

import { IPrivateUser, IUser } from "threadit/types";

class UserModel {
  private tableName = "user_account";
  private userFields = ["user_id", "email", "username", "verified", "created_at", "updated_at"];
  constructor(private db: Knex<any, unknown[]>) {}

  public async findAll(): Promise<IUser[] | undefined> {
    return this.db<IUser[]>(this.tableName).select(...this.userFields);
  }

  public async findById(id: string): Promise<IUser | undefined> {
    return this.db<IUser>(this.tableName)
      .select(...this.userFields)
      .where("user_id", id)
      .first();
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return this.db<IUser>(this.tableName)
      .select(...this.userFields)
      .where({ email })
      .first();
  }

  public async create(email: string, password: string, username: string): Promise<IUser | undefined> {
    const [user] = await this.db(this.tableName)
      .returning(this.userFields)
      .insert<IUser[]>({ email, password, username });
    return user;
  }

  public async findByIdOrEmailUnsafe(identifier: string): Promise<IPrivateUser | undefined> {
    const obj = identifier.includes("@") ? { email: identifier } : { user_id: identifier };
    const [user] = await this.db(this.tableName)
      .select([...this.userFields, "password"])
      .where(obj);
    return user;
  }

  public async usernameTaken(username: string) {
    return this.db(this.tableName).select("username").where({ username }).first();
  }
}

export default UserModel;
