/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert, expect } = require("chai");
const sinon = require("sinon");
const client = require("../../lib/datasource");
const helpers = require("../../lib/helpers");
const jwt = require("jsonwebtoken");
const fixtures = require("../fixtures/data");
const g = require("../fixtures/gql");
const createTestSever = require("../testHelpers");

describe("Post resolvers", function() {
  const sandbox = sinon.createSandbox();
  const config = { client, req: { headers: { authorization: "token" } } };
  const userProfile = {
    ...fixtures.user,
    profileId: "10",
  };

  beforeEach(() => {
    sinon.stub(jwt, "verify").returns({ data: { user: { ...userProfile } } });
    sinon.stub(helpers, "isAuthenticated");
  });

  afterEach(() => {
    jwt.verify.restore();
    helpers.isAuthenticated.restore();
    sandbox.restore();
  });

  describe("getProfile", () => {
    it("should get a user profile when a user is authenticated", async function() {
      // mock what the database returns
      const getUserProfile = sinon.stub(client, "getUserProfile").returns(fixtures.userProfile);

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const { data } = await query({
        query: g.GET_PROFILE,
        variables: {
          id: fixtures.userProfile.profileId,
        }
      });

      // Restore mocked functions
      getUserProfile.restore();

      // Check the shape of the response
      assert.deepEqual(data.getProfile, fixtures.profile);
    });
    it("should throw an error when a user is not found", async function() {
      // mock what the database returns
      const getUserProfile = sinon.stub(client, "getUserProfile").returns([]);

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const res = await query({
        query: g.GET_PROFILE,
        variables: {
          id: fixtures.userProfile.profileId,
        }
      });

      // Restore mocked functions
      getUserProfile.restore();

      // Check the shape of the response
      // TODO: Understand asserting throws
      expect(query).throw();
      expect(res).to.have.nested.property("errors[0].message");
      assert.equal(res.errors[0].message, "User not found!");
      sandbox.assert.calledWith(getUserProfile, fixtures.userProfile.profileId);
    });
  });
});
