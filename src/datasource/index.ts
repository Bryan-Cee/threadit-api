import knex from "../../knex";
import UserModel from "./models/User.model";
import ProfileModel from "./models/Profile.model";
import CommunityModel from "./models/Community.model";

export interface Model {
    User: UserModel
    Profile: ProfileModel
    Community: CommunityModel
}

const User = new UserModel(knex);
const Profile = new ProfileModel(knex);
const Community = new CommunityModel(knex);

const models: Model = {
    User,
    Profile,
    Community
};

export default models;
