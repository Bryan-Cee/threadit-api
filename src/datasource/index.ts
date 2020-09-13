import knex from "../../knex";
import UserModel from "./models/User.model";

const User = new UserModel(knex);

export default {
    User
}
