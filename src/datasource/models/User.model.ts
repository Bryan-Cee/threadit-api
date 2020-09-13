import Knex from "knex";

export interface IUser {
    user_id: string,
    email: string,
    username: string,
    verified: boolean,
    created_at: string,
    updated_at: string,
}

class UserModel {
    private tableName = "user_account";
    private userFields = ["user_id", "email", "username", "verified","created_at", "updated_at"];
    constructor(private db: Knex<any, unknown[]>) {}

    public async findAll(): Promise<IUser[] | undefined> {
        return this.db<IUser[]>(this.tableName)
          .select(...this.userFields);
    }

    public async findById(id: number): Promise<IUser | undefined> {
        return this.db<IUser>(this.tableName)
          .select(...this.userFields)
          .where("user_id", id)
          .first();
    }

    public async findByEmail(email: string): Promise<IUser | undefined>  {
        return this.db<IUser>(this.tableName)
          .select(...this.userFields)
          .where({ email }).first();
    }

    public async create(email: string, password: string, username: string): Promise<IUser | undefined> {
        const [user] = await this.db(this.tableName)
          .returning(this.userFields)
          .insert<IUser[]>({ email, password, username });
        return user;
    }

    public async usernameTaken(username: string) {
        return this.db(this.tableName).select("username").where({ username }).first();
    }
}

export default UserModel;
