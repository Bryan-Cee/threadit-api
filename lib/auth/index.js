require("dotenv-safe").config({ allowEmptyValues: true });
const { AuthenticationError } = require("apollo-server");
const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");

function authenticate(req) {
  const Authorization = req.headers.authorization;
  if (!Authorization) {
    throw new AuthenticationError("You are not authenticated, please log in!");
  }

  const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  });

  const token = Authorization.replace("Bearer ", "");

  function getKey(header, cb) {
    client.getSigningKey(header.kid, function(_err, key) {
      var signingKey = key.publicKey || key.rsaPublicKey;
      cb(null, signingKey);
    });
  }

  const options = {
    audience: `https://${process.env.AUTH_AUDIENCE}/`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"]
  };

  const user = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });

  return user;
}

module.exports = authenticate;
