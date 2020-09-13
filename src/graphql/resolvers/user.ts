import { UserInputError } from "apollo-server";
import { GraphQLError } from "graphql";
import { errors } from "../../constants/errors";

export const login = async (_: unknown, { email, password }: Record<string, string>, { model }: any) => {
    const user = await model.User.findByEmail(email);
    if (!user) {
        throw new UserInputError(errors.USER_NOT_FOUND);
    }

    return {
        token: "token",
        user
    }
};

export const createAccount = async (_: any, { email, password }: Record<string, string>, { model }: any) => {
    // Check if user exist
    const user = await model.User.findByEmail(email);
    if (user) {
        throw new UserInputError(errors.USER_ALREADY_EXISTS);
    }
    // Create new user
    try {
        // Check if username exist and generate a unique one if it does
        let username = email.split("@")[0];
        if (await model.User.usernameTaken(username)) {
            username = `${username}_${Math.round(Math.random() * 10000)}`;
        }
        const newUser = await model.User.create(email, password, username);
        return {
            token: "token",
            user: newUser
        }
    } catch (e) {
        console.log(e);
        throw new GraphQLError(errors.INTERNAL_SERVER_ERROR)
    }
};
