import Knex from "knex";
import { ICount, ICreateProfile, IMutateProfile, IProfile } from "threadit/types";

class ProfileModel {
    private tableName = "user_profile";
    constructor(private db: Knex<any, unknown[]>) {}

    private getModel = () => this.db.table(this.tableName);

    public async findAll(offset: number = 0, limit: number = 5): Promise<{ count: string, data: IProfile[] }> {
        const [totalCount] = await this.getModel().count() as [ICount];
        const data = await this.getModel().offset(offset).limit(limit).select();
        return {
            count: totalCount.count,
            data
        }
    }

    public async findById(profile_id: string): Promise<IProfile | undefined> {
        return this.getModel().select().where("profile_id", profile_id).first();
    }

    public async findByUserId(user_id: string): Promise<IProfile | undefined> {
        return this.getModel().select().where("user_id", user_id).first();
    }

    public async create(data: ICreateProfile): Promise<IProfile> {
        return this.getModel().returning(["*"]).insert(data);
    }

    public async update(data: IMutateProfile, profile_id: string): Promise<IProfile[]> {
        return this.getModel().update(data, "*").where({ profile_id });
    }
}

export default ProfileModel;
