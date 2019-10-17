const isEmail = require("validator/lib/isEmail");
const isLength = require("validator/lib/isLength");
const matches = require("validator/lib/matches");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

module.exports = {
  register: async (_, { email, password }, { client }) => {
    // validate email
    if (!isEmail(email)) {
      throw new Error("Please enter a valid email!");
    }
    // validate password
    if (!isLength(password, 8)) {
      throw new Error("The password must be eight characters or longer");
    }
    // TODO:
    //  regex not matching uppercase and lowercase correctly
    if (!matches(password, /(?=.*[A-Z]+)/i)) {
      throw new Error(`The password must contain at least 1
         uppercase alphabetical character`);
    }
    if (!matches(password, /(?=.*[a-z])/i)) {
      throw new Error(`The password must contain at least 1 
        lowercase alphabetical character`);
    }
    if (!matches(password, /(?=.*[0-9])/i)) {
      throw new Error(`The password must contain at least 1 
        numeric character`);
    }
    if (!matches(password, /(?=.*[!@#$%^&*])/i)) {
      throw new Error(`The password must contain at least 
        one special character`);
    }
    // Hash password then store it in the database.
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    let username = email.split("@")[0];
    let user;
    try {
      // Check if username exist and
      // generate a unique one if it does
      if (await client.usernameTaken(username)) {
        username = `${username}_${Math.round(Math.random() * 1000)}`;
      }
      user = await client.createUser(email, hashedPassword, username);
    } catch (e) {
      if (e && e.detail && e.detail.includes("Key")) {
        // Format error message
        const errorMessage = `${e.detail
          .replace("Key", "User with")
          .replace(/\(/g, "")
          .replace(/\)/g, "")} Try logging in!`;
        throw new Error(errorMessage);
      }
      throw new Error(e);
    }
    return user;
  },
  login: async (_, { email, password }, { client }) => {
    const user = await client.getUserByEmail(email);
    if (Array.isArray(user)) {
      throw new Error(
        `Wrong email-password combination, please check and try again`
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error(
        `Wrong email-password combination, please check and try again`
      );
    }
    delete user.password;

    const token = jwt.sign({
      data: {
        userId: user.userId,
        email: user.email,
        username: user.username
      }
    }, process.env.SECRET_KEY, {
      expiresIn: "30d"
    });
    return { token, user };
  },
  forgotPassword: async (_, { email }, { client }) => {
    // TODO:
    //  validate email
    //  check if it exist in the database
    //  send email otherwise ask the person to register

    const user = await client.getUserByEmail(email);
    if (Array.isArray(user)) {
      throw new Error(
        `Email not found, please check and try again!`
      );
    }

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "test@example.com",
      subject: "PASSWORD RESET",
      text: "Click here to reset your account password",
      html: fs.readFileSync(
        path.join(__dirname, "..", "..", "..",
          "/helpers/templates/password_reset.html"),
        "utf8"
      )
    };
    try {
      await sgMail.send(msg);
    } catch (e) {
      throw new Error(e);
    }
    return "The password reset link has been sent to your email.";
  }
};
