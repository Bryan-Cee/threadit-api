require("dotenv").config();

import jwt from "express-jwt";

const auth = jwt({
    secret: process.env.SECRET_KEY || "a-strong-key",
    algorithms: ['HS256']
});

export default auth;
