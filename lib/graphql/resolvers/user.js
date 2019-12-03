const { UserInputError, AuthenticationError } = require("apollo-server");
const useragent = require("useragent");
const isEmail = require("validator/lib/isEmail");
const isLength = require("validator/lib/isLength");
const matches = require("validator/lib/matches");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { isAuthenticated } = require("../../helpers");
const { resetTemplate, wrongEmailTemplate } = require("../../helpers/template");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  register: async (_, { email, password }, { client }) => {
    const userInputError = {};
    // validate email
    if (!isEmail(email)) {
      throw new UserInputError("Please enter a valid email!");
    }
    // validate password
    try {
      if (!isLength(password, 8)) {
        throw new UserInputError(
          "The password must be eight characters or longer"
        );
      }
      // TODO:
      //  regex not matching uppercase and lowercase correctly
      if (!matches(password, /(?=.*[A-Z]+)/i)) {
        throw new UserInputError(`The password must contain at least 1
         uppercase alphabetical character`);
      }
      if (!matches(password, /(?=.*[a-z])/i)) {
        throw new UserInputError(`The password must contain at least 1 
        lowercase alphabetical character`);
      }
      if (!matches(password, /(?=.*[0-9])/i)) {
        throw new UserInputError(`The password must contain at least 1 
        numeric character`);
      }
      if (!matches(password, /(?=.*[!@#$%^&*])/i)) {
        throw new UserInputError(`The password must contain at least 
        one special character`);
      }
    } catch (e) {
      userInputError.password = e.message;
      throw new UserInputError(e.message, { userInputError });
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
      userInputError.email = e.message;
      throw new UserInputError(e.message, { userInputError });
    }

    const token = jwt.sign({
      data: {
        userId: user.userId,
        email: user.email,
        username: user.username
      }
    }, process.env.SECRET_KEY, {
      expiresIn: "3hr"
    });
    // send email to the user to verify the account
    const msg = {
      to: email,
      from: "test@example.com",
      subject: "THREADIT VERIFY ACCOUNT",
      text: "Click here to verify your account",

      html: `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                </style>
                <title>ThreadIt</title>
            </head>
            <body style="background-color:#efefef !important; 
            padding: 1em !important" >
                <div style="padding:1em 2em 2em; 
                background: #ffffff !important
                width: 80%; margin: 1em auto">
                    <div align="center" valign="top"
                         style=" font-size: 26px; line-height: 29px; 
                         color:#264780; font-weight:bold;">
                        <h3  style="padding: 0;">Verify your account</h3>
                    </div>
                    <div class="em_grey" align="center" valign="top" >
                        Thank you for creating an account with us.
                    </div>
                    <div align="center" valign="top" style="margin: 2em;">
                        <a href="${process.env.FRONTEND_URL}/verify/${token}">
                            <button style="padding: 0 1em; font-weight: bold;
                            color:#ffffff; line-height:42px; 
                            background-color:#6bafb2; border: none; 
                            border-radius:4px;">VERIFY ACCOUNT</button>
                        </a>
                    </div>
                    <div class="em_grey" align="center" valign="top">
                        If you didn&rsquo;t sign up to our platform,
                        you don&rsquo;t have to do anything.
                        <br class="em_hide"/>
                        Just ignore this email the way your cat 
                        ignores&nbsp;you.
                    </div>
                </div>
            </body>
        </html>
      `
    };
    try {
      await sgMail.send(msg);
    } catch (e) {
      throw new Error(e);
    }
    // eslint-disable-next-line max-len
    const message = `Please check your email ${user.email} to verify your account. The link expires in three hours`;
    return message;
  },
  login: async (_, { email, password }, { client }) => {
    const user = await client.getUserByEmail(email);

    const userInputError = {};
    if (Array.isArray(user)) {
      userInputError.email = "Email not registered, " +
        "please check and try again";
      throw new UserInputError(
        `Wrong email-password combination, please check and try again`,
        { userInputError }
      );
    }

    if (!(user.verified)) {
      throw new AuthenticationError(
        // eslint-disable-next-line max-len
        "Please verify your account through the link sent to your email to log in!"
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      userInputError.password = "Wrong email-password " +
        "combination, please check and try again";
      throw new UserInputError(
        `Wrong email-password combination, please check and try again`,
        { userInputError }
      );
    }
    delete user.password;

    const token = jwt.sign({
      data: { ...user }
    }, process.env.SECRET_KEY, {
      expiresIn: "3hr"
    });
    return { token, user };
  },
  resetRequest: async (_, { email }, { client, req }) => {
    let msg, data;
    const user = await client.getUserByEmail(email);
    const agent = useragent.parse(req.headers["user-agent"]);

    if (Array.isArray(user)) {
      data = {
        actionUrl: `${process.env.FRONTEND_URL}/reset/password`,
        email: email,
        operatingSystem: agent.os.toString(),
        browserName: agent.toAgent()
      };

      msg = {
        to: email,
        from: "test@example.com",
        subject: "PASSWORD RESET",
        text: "Click here to reset your account password",
        html: wrongEmailTemplate(data)
      };
    } else {
      const secretKey = `${user.password}-${+user.createdAt}`;
      const token = jwt.sign({
        data: {
          userId: user.userId,
          email: user.email,
        },
        maxAge: "1h"
      }, secretKey, {
        expiresIn: "1h"
      });

      data = {
        // eslint-disable-next-line max-len
        actionUrl: `${process.env.FRONTEND_URL}/reset/${user.userId}?token=${token}`,
        name: user.username,
        operatingSystem: agent.os.toString(),
        browserName: agent.toAgent()
      };

      msg = {
        to: email,
        from: "test@example.com",
        subject: "PASSWORD RESET",
        text: "Click here to reset your account password",
        html: resetTemplate(data)
      };
    }

    try {
      await sgMail.send(msg);
    } catch (e) {
      throw new Error(e);
    }
    return "The password reset link has been sent to your email." +
      " It expires in an hour";
  },
  resetPassword: async (_, { password }, { client, req }) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("Something went wrong!");
    }
    const token = authorization.replace("Bearer ", "");
    const user = await client.getUserAccountById(10);
    const secretKey = `${user.password}-${+user.createdAt}`;
    try {
      const { data: { userId, email } } = jwt.verify(token, secretKey);

      if (userId !== user.userId && email !== user.email) {
        console.log("The user details do not match!");
        throw new Error("The user details do not match!");
      }
      // Change the users password
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const _reset = await client
        .setUserPassword(userId, email, hashedPassword);
      if (_reset === 1) {
        return {
          message: "Password reset successful",
          success: true,
        };
      } else {
        throw new Error("Password was not changed");
      }
    } catch (e) {
      return {
        // eslint-disable-next-line max-len
        message: "Password reset unsuccessful, please try resetting your password again!",
        success: false,
      };
    }
  },
  verifyAccount: async (_, { id }, { client, req }) => {
    const { userId } = isAuthenticated(req);
    const user = await client.verifyAccount(userId);
    const token = jwt.sign({
      data: { ...user }
    }, process.env.SECRET_KEY, {
      expiresIn: "3hr"
    });
    return { token, user };
  }
};
