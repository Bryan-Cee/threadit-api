import { UserInputError } from "apollo-server-express";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { errors } from "threadit/errors";

const SECRET = process.env.SECRET_KEY || "a-strong-key";
const REFRESH_KEY = process.env.REFRESH_KEY || "a-strong-key";


export const login = async (_: unknown, { email, password }: Record<string, string>, { model, res }: any) => {
    const user = await model.User.findByIdOrEmailUnsafe(email);
    if (!user) {
        throw new UserInputError(errors.USER_NOT_FOUND);
    }

    // const match = await bcrypt.compare(password, user.password);
    // if (!match) {
    //     throw new AuthenticationError(errors.INVALID_CREDENTIALS);
    // }

    const userDetails = {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        verified: user.verified
    };

    const token = jwt.sign({ user: userDetails }, SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign({ user: userDetails }, REFRESH_KEY + user.password, { expiresIn: '1h' });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 7 days
        ...(process.env.NODE_ENV === "production" && { domain: 'example.com' }), //on HTTPS
    });
    res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        ...(process.env.NODE_ENV === "production" && { domain: 'example.com' }), //on HTTPS
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

        const profile = await model.Profile.create({
            user_id: newUser.user_id
        });

        const token = jwt.sign(
          {
              user_id: newUser.user_id,
              profile_id: profile.profile_id
          },
          SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            ...(process.env.NODE_ENV === "production" ? { domain: 'example.com' }: {}), //on HTTPS
        });

        return { token, user: newUser }
    } catch (e) {
        console.log(e);
        throw new GraphQLError(errors.INTERNAL_SERVER_ERROR)
    }
};
