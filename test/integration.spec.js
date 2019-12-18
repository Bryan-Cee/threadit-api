/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert, expect } = require("chai");
const sinon = require("sinon");
const test = require("sinon-test")(sinon, { useFakeTimers: false });
const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
const { config } = require("../lib/graphql");
const client = require("../lib/datasource");
const helpers = require("../lib/helpers");
const jwt = require("jsonwebtoken");

sinon.test = test;

function createTestSever(context) {
  const _config = { ...config, context };
  const server = new ApolloServer(_config);
  return { server };
}

describe("Queries and Mutations", function() {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Login query", function() {
    const server = new ApolloServer(config);
    const LOGIN = gql`
        mutation SignIn($email: String!, $password: String!){
            login(email: $email, password: $password) {
                token
                user {
                    userId
                    username
                    email
                }
            }
        }
    `;
    const user = {
      userId: "1",
      username: "cheruiyotbryan",
      email: "cheruiyotbryan@gmail.com",
    };
    const userAccount = {
      ...user,
      verified: true,
      password: "$2b$10$rfCQ4m0iWVrdPgPPVjaMRO338400suVI/AemqiapxKU5prSB3diWq",
    };
    const userProfile = {
      ...user,
      profileId: "10",
      name: null,
      bio: null,
      location: null,
      avatar: null,
      firstSetup: true,
      verified: true,
      createdAt: "2019-12-12T15:26:50.468Z",
      updatedAt: "2019-12-12T15:26:50.468Z"
    };

    it("should return a token and user object", sinon.test(async function() {
      // mock what the database returns
      const getUserProfile = sinon.stub(client, "getUserProfile").returns(userProfile);
      const getUserByEmail = sinon.stub(client, "getUserByEmail").returns(userAccount);

      // Create the test server
      const { query } = createTestClient(server);

      // Run the query
      const res = await query({
        query: LOGIN,
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
      expect(res.data.login.user).to.include({ ...user });
    }));
    it("should return a message when wrong credentials are used", async function() {
      // mock what the database returns
      const getUserByEmail = sinon.stub(client, "getUserByEmail").returns({
        ...user,
        verified: true,
        password: "$2b$10$rfCQ4m0iWVrdPgPPVjaMRO338400suVI/AemqiapxKU5prSB3diWq",
      });

      // Create the test server
      const { query } = createTestClient(server);

      // Run the query
      const res = await query({
        query: LOGIN,
        variables: {
          email: "cheruiyotbryan@gmail.com", password: "Qwerty123"
        }
      });

      // Restore mocked functions
      getUserByEmail.restore();

      // Check the shape of the response
      sandbox.assert.calledOnce(getUserByEmail);
      expect(res).to.have.nested.property("errors[0].message");
      expect(res).to.have.nested.property("errors[0].extensions.userInputError");
      expect(res.errors[0].message).to.equal("Wrong email-password combination, please check and try again");
      expect(res.errors[0].extensions.userInputError.password).to.equal("Wrong email-password combination, please check and try again");
      expect(res.errors[0].extensions.code).to.equal("BAD_USER_INPUT");
    });
  });

  describe("Post query", function() {
    // TODO : Mock the response for getting the author and
    //  the founder of a community
    //  - Mock the response for getting a community
    //  - Mock the response for getCommunityMemberId
    const CREATE_POST = gql`
        mutation createPost($content: String!, $communityId: Int){
            createPost(content: $content, communityId: $communityId){
                postId
                content
                author{
                    userId
                    profileId
                    username
                    email
                }
                community{
                    communityId
                    name
                    founder{
                        username
                        email
                    }
                    description
                }
                createdAt
                updatedAt
            }
        }`;
    const user = {
      userId: "1",
      username: "cheruiyotbryan",
      email: "cheruiyotbryan@gmail.com",
    };
    const userProfile = {
      ...user,
      profileId: "10",
    };
    const authorCommunity = { id: 12 };
    const community = {
      communityId: "1",
      name: "Thread-it",
      founderId: 10,
      description: "The main community every user joins by default"
    };
    const post = {
      postId: "1",
      content: "Everything is new",
    };
    const founderDetails = {
      username: "cambrian",
      email: "ceebryan@gmail.com"
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
      const getCommunityById = sinon.stub(client, "getCommunityById").returns(community);
      const getProfileById = sinon.stub(client, "getProfileById");

      getProfileById.onFirstCall().returns(founderDetails);
      getProfileById.onSecondCall().returns(userProfile);

      // Create the test server
      const config = { client, req: { headers: { authorization: "token" } } };
      const { server } = createTestSever(config);
      const { query } = createTestClient(server);

      // Run the query
      const res = await query({
        query: CREATE_POST,
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
      sandbox.assert.calledWith(getProfileById.firstCall, community.founderId);
      sandbox.assert.calledWith(getProfileById.secondCall, userProfile.profileId);

      const expectedRes = {
        ...post,
        community,
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
      const config = { client, req: { headers: { authorization: "token" } } };
      const { server } = createTestSever(config);
      const { query } = createTestClient(server);

      // Run the query
      const res = await query({
        query: CREATE_POST,
        variables: {
          content: post.content,
          communityId: 10
        }
      });

      // Restore mocked functions
      getCommunityMemberId.restore();

      // Check the shape of the response
      sandbox.assert.calledOnce(getCommunityMemberId);
      sandbox.assert.calledWith(getCommunityMemberId, userProfile.profileId, 10);
      expect(res).to.have.nested.property("errors[0].message");
      expect(res.errors[0].message).to.equal("You cannot post in a community you do not belong to!");
      expect(res.errors[0].extensions.code).to.equal("FORBIDDEN");
    });
  });
});
