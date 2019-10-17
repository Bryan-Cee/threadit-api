const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

function isAuthenticated(req) {
  const Authorization = req.headers.authorization;

  if (!Authorization) {
    throw new AuthenticationError("You are not authenticated, please log in!");
  }
  const token = Authorization.replace("Bearer ", "");
  const { data } = jwt.verify(token, process.env.SECRET_KEY);
  return data;
}

module.exports = {
  isAuthenticated
};
