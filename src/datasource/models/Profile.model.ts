import Knex from "knex";
import faker from "faker";

export interface IProfile {
    profile_id: string,
    name: string,
    avatar: string,
    bio: string,
    location: string,
    first_setup: string,
    created_at: string,
    updated_at: string,
    user_id: string,
}

export interface ICreateProfile {
    name?: string,
    avatar?: string,
    bio?: string,
    location?: string,
    user_id: string
}

export interface IUpdateProfile {
    name?: string,
    avatar?: string,
    bio?: string,
    location?: string,
}

export interface ICount {
    count: string
}

class ProfileModel {
    private tableName = "user_profile";
    constructor(private db: Knex<any, unknown[]>) {}

    private getModel = () => this.db.table(this.tableName);

    public async findAll(offset: number = 0, limit: number = 5): Promise<{ totalCount: string, data: IProfile[] }> {
        const [totalCount] = await this.getModel().count() as [ICount];
        const data = await this.getModel().offset(offset).limit(limit).select();
        return {
            totalCount: totalCount.count,
            data
        }
    }

    public async findById(profile_id: string): Promise<IProfile | undefined> {
        return this.getModel().select().where("profile_id", profile_id).first();
    }

    public async create(data: ICreateProfile): Promise<IProfile | undefined> {
        return this.getModel().returning(["*"]).insert(data);
    }

    public async update(data: IUpdateProfile, profile_id: string): Promise<IProfile[]> {
        return this.getModel().update(data, "*").where({ profile_id });
    }
}

export default ProfileModel;
