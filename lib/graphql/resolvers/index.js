
const validator = require("validator");
var bcrypt = require("bcrypt");

module.exports = {
  Query: {
    test: async (_, __, { client }) => {
      const result = await client.testQuery();
      return `Hello ${result}`;
    },
    user: async (_, { id }, { client }) => {
      const user = await client.getUserById(id);
      return user;
    }
  },
  Mutation: {
    register: async (_, { email, password }, { client }) => {
      // validate email
      if (!validator.isEmail(email)) {
        throw new Error("Please enter a valid email!");
      }
      // validate password
      if (!validator.isLength(password, 8)) {
        throw new Error("The password must be eight characters or longer");
      }

      // TODO:
      //  regex not matching uppercase and lowercase correctly
      if (!validator.matches(password, /(?=.*[A-Z]+)/i)) {
        throw new Error(`The password must contain at least 1
         uppercase alphabetical character`);
      }
      if (!validator.matches(password, /(?=.*[a-z])/i)) {
        throw new Error(`The password must contain at least 1 
        lowercase alphabetical character`);
      }
      if (!validator.matches(password, /(?=.*[0-9])/i)) {
        throw new Error(`The password must contain at least 1 
        numeric character`);
      }
      if (!validator.matches(password, /(?=.*[!@#$%^&*])/i)) {
        throw new Error(`The password must contain at least 
        one special character`);
      }

      // Hash password then store it in the database.
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      let user;
      try {
        user = await client.createUser(email, hashedPassword);
      } catch (e) {
        if (e && e.detail && e.detail.includes("Key")) {
          const errorMessage = e.detail
            .replace("Key", "User with")
            .replace(/\(/g, "")
            .replace(/\)/g, "");
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
