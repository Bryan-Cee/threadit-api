
const isEmail = require("validator/lib/isEmail");
const isLength = require("validator/lib/isLength");
const matches = require("validator/lib/matches");
const bcrypt = require("bcrypt");

module.exports = {
  Query: {
    user: async (_, { id }, { client }) => {
      const user = await client.getUserById(id);
      return user;
    }
  },
  Mutation: {
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
    }
  }
};

// TODO
// - Consider using directives for authentication
// - Implement the use of refreshTokens with accessTokens
// - Consider using cookies for authentication
