import knex from "../../knex";
import UserModel from "./models/User.model";
import ProfileModel from "./models/Profile.model";

export interface Model {
    User: UserModel
    Profile: ProfileModel
}

const User = new UserModel(knex);
const Profile = new ProfileModel(knex);

const models: Model = {
    User,
    Profile
};

export default models;
