/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert, expect } = require("chai");
const sinon = require("sinon");
const { ApolloServer } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const { config } = require("../../lib/graphql");
const client = require("../../lib/datasource");
const helpers = require("../../lib/helpers");
const jwt = require("jsonwebtoken");
const fixtures = require("../fixtures/data");
const g = require("../fixtures/gql");

function createTestSever(context = config.context) {
  const _config = { ...config, context };
  const server = new ApolloServer(_config);
  const { query } = createTestClient(server);
  return { query };
}

describe("Mutations", function() {
  let sandbox;
  const config = { client, req: { headers: { authorization: "token" } } };
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Post mutation", function() {
    const userProfile = {
      ...fixtures.user,
      profileId: "10",
    };
    const authorCommunity = { id: 12 };
    const post = {
      postId: "1",
      content: "Everything is new",
    };

    beforeEach(() => {
      sinon.stub(jwt, "verify").returns({ data: { user: { ...userProfile } } });
      sinon.stub(helpers, "isAuthenticated");
    });

    afterEach(() => {
      jwt.verify.restore();
      helpers.isAuthenticated.restore();
    });

    it("should create a post in community id 1 when communityId is not passed", async function() {
      // mock what the database returns
      const createPost = sinon.stub(client, "createPost").returns(post);
      const getCommunityMemberId = sinon.stub(client, "getCommunityMemberId").returns(authorCommunity);
      const getCommunityById = sinon.stub(client, "getCommunityById").returns(fixtures.community);
      const getProfileById = sinon.stub(client, "getProfileById");

      getProfileById.onFirstCall().returns(fixtures.founder);
      getProfileById.onSecondCall().returns(userProfile);

      // Create the test server
      const { query } = createTestSever(config);
      // Run the query
      const res = await query({
        query: g.CREATE_POST,
        variables: {
          content: post.content
        }
      });

      // Restore mocked functions
      createPost.restore();
      getCommunityMemberId.restore();
      getCommunityById.restore();
      getProfileById.restore();

      // Check the shape of the response
      sandbox.assert.calledWith(createPost, post.content, authorCommunity.id);
      sandbox.assert.calledWith(getCommunityMemberId, userProfile.profileId, 1);
      sandbox.assert.calledWith(getCommunityById, 1);
      sandbox.assert.calledWith(getProfileById.firstCall, fixtures.community.founderId);
      sandbox.assert.calledWith(getProfileById.secondCall, userProfile.profileId);

      const expectedRes = {
        ...post,
        community: fixtures.community,
        author: userProfile,
        createdAt: null,
        updatedAt: null
      };

      delete expectedRes.community.founderId;

      assert.deepEqual(res.data.createPost, expectedRes);
    });
    it("should throw an error when a user tries to create a post in a community they are not part of", async function() {
      const getCommunityMemberId = sinon.stub(client, "getCommunityMemberId").returns([]);

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const res = await query({
        query: g.CREATE_POST,
        variables: {
          content: post.content,
          communityId: 10
        }
      });

      // Restore mocked functions
      getCommunityMemberId.restore();

      // Check the shape of the response
      const errorMessage = "You cannot post in a community you do not belong to!";
      sandbox.assert.calledOnce(getCommunityMemberId);
      sandbox.assert.calledWith(getCommunityMemberId, userProfile.profileId, 10);
      expect(res).to.have.nested.property("errors[0].message");
      expect(res.errors[0].message).to.equal(errorMessage);
      expect(res.errors[0].extensions.code).to.equal("FORBIDDEN");
    });
  });
  describe("Login mutation", function() {
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
