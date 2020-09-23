import { AuthenticationError, UserInputError } from "apollo-server-express";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { errors } from "../../constants/errors";

const SECRET_KEY = process.env.SECRET_KEY || "Secret-Key";

export const login = async (_: unknown, { email, password }: Record<string, string>, { model, res }: any) => {
    const user = await model.User.findByEmail(email);
    if (!user) {
        throw new UserInputError(errors.USER_NOT_FOUND);
    }

    // const match = await bcrypt.compare(password, user.password);
    // if (!match) {
    //     throw new AuthenticationError(errors.INVALID_CREDENTIALS);
    // }

    const token = jwt.sign( { id: user.user_id, email: user.email }, SECRET_KEY);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        ...(process.env.NODE_ENV === "production" ? { domain: 'example.com' }: {}), //on HTTPS
    });

    return { login: true };
};

export const register = async (_: any, { email, password }: Record<string, string>, { model, res }: any) => {
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

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await model.User.create(email, hashedPassword, username);

        const token = jwt.sign(
          { userId: newUser.user_id },
          SECRET_KEY,
          { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            ...(process.env.NODE_ENV === "production" ? { domain: 'example.com' }: {}), //on HTTPS
        });
        console.log({ res });
        return { token, user: newUser }
    } catch (e) {
        console.log(e);
        throw new GraphQLError(errors.INTERNAL_SERVER_ERROR)
    }
};
