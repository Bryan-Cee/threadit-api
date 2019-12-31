/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const client = require("../../lib/datasource");
const fixtures = require("../fixtures/data");
const g = require("../fixtures/gql");
const createTestSever = require("../testHelpers");

describe("User resolvers", function() {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("login", () => {
    it("should return a token and user object", async function() {
      // mock what the database returns
      const getUserProfile = sinon.stub(client, "getUserProfile").returns({ ...fixtures.userProfile });
      const getUserByEmail = sinon.stub(client, "getUserByEmail").returns(fixtures.userAccount);

      // Create the test server
      const { query } = createTestSever();

      // Run the query
      const res = await query({
        query: g.LOGIN,
        variables: {
          email: "cheruiyotbryan@gmail.com", password: "Qwerty123@"
        }
      });
      // Restore mocked functions
      getUserByEmail.restore();
      getUserProfile.restore();

      // Check the shape of the response
      sandbox.assert.calledOnce(getUserByEmail);
      sandbox.assert.calledOnce(getUserProfile);
      expect(res).to.have.nested.property("data.login.token");
      expect(res).to.have.nested.property("data.login.user");
      expect(res.data.login.token).to.be.a("string");
      expect(res.data.login.user).to.include({ ...fixtures.user });
    });
    it("should return a message when wrong credentials are used", async function() {
      // mock what the database returns
      const getUserByEmail = sinon.stub(client, "getUserByEmail").returns(fixtures.userAccount);

      // Create the test server
      const { query } = createTestSever();

      // Run the query
      const res = await query({
        query: g.LOGIN,
        variables: {
          email: "cheruiyotbryan@gmail.com", password: "Qwerty123"
        }
      });

      // Restore mocked functions
      getUserByEmail.restore();

      // Check the shape of the response
      const errorMessage = "Wrong email-password combination, please check and try again";
      sandbox.assert.calledOnce(getUserByEmail);
      expect(res).to.have.nested.property("errors[0].message");
      expect(res).to.have.nested.property("errors[0].extensions.userInputError");
      expect(res.errors[0].message).to.equal(errorMessage);
      expect(res.errors[0].extensions.userInputError.password).to.equal(errorMessage);
      expect(res.errors[0].extensions.code).to.equal("BAD_USER_INPUT");
    });
  });
});
