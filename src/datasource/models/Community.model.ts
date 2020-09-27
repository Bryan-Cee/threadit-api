import Knex from "knex";
import { IContext, IMutateCommunity, ICommunity } from "threadit/types";

class CommunityModel {
    private tableName = "community";
    constructor(private db: Knex<any, unknown[]>) {}

    private getModel = () => this.db.table(this.tableName);

    public async create(data: IMutateCommunity, founder_id: string): Promise<ICommunity[]> {
        return this.getModel().returning(["*"]).insert({ ...data, founder_id });
    }

}

export default CommunityModel;
