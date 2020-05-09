/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert, expect } = require("chai");
const sinon = require("sinon");
const client = require("../../lib/datasource");
const jwt = require("jsonwebtoken");
const fixtures = require("../fixtures/data");
const g = require("../fixtures/gql");
const createTestSever = require("../testHelpers");

describe("Community resolvers", function() {
  const sandbox = sinon.createSandbox();
  const config = { client, req: { headers: { authorization: "token" } } };
  const user = { userId: 1 };
  beforeEach(() => {
    sinon.stub(jwt, "verify").returns({ data: user });
  });

  afterEach(() => {
    jwt.verify.restore();
    sandbox.restore();
  });

  describe("communities", () => {
    it("communities should return a list of communities", async function() {
      // mock what the database returns
      const communityList = sinon.stub(client, "getCommunityList").returns(fixtures.communityListData);
      const getProfileById = sinon.stub(client, "getProfileById").returns(fixtures.founder);
      const args = { first: 10, after: 0 };

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const res = await query({
        query: g.GET_COMMUNITIES,
        variables: args,
      });

      // Restore mocked functions
      communityList.restore();
      getProfileById.restore();

      // Assert the response
      assert.deepEqual(res.data.communities, fixtures.communityListData);
    });
  });
  describe("createCommunity", () => {
    it("should return the details of a community when create a community is created", async function() {
      const createCommunity = sinon.stub(client, "createCommunity").returns(fixtures.community);
      const getProfileById = sinon.stub(client, "getProfileById").returns(fixtures.founder);
      const args = { name: "Testing Threadit", description: "just testing" };

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const res = await query({
        query: g.CREATE_COMMUNITY,
        variables: args,
      });

      createCommunity.restore();
      getProfileById.restore();

      sandbox.assert.calledWith(createCommunity, args.name, args.description, user.userId);
      sandbox.assert.calledWith(getProfileById, 1);
      expect(res).to.have.nested.property("data.createCommunity");
      expect(res).to.have.nested.property("data.createCommunity.founder");
      assert.deepEqual(res.data.createCommunity.founder, fixtures.founder);
    });
  });
  describe("joinCommunity", () => {
    it("should return the community a user joins", async function() {
      const community = { name: "Testing Threadit", description: "just testing" };
      const joinCommunity = sinon.stub(client, "joinCommunity").returns(community);
      const args = { communityId: "2" };

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const res = await query({
        query: g.JOIN_COMMUNITY,
        variables: args,
      });

      joinCommunity.restore();

      sandbox.assert.calledWith(joinCommunity, args.communityId, user.userId);
      expect(res).to.have.nested.property("data.joinCommunity");
      assert.deepEqual(res.data.joinCommunity, community);
    });
  });
});
