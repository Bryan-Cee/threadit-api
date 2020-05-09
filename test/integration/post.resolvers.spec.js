/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert, expect } = require("chai");
const sinon = require("sinon");
const client = require("../../lib/datasource");
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
  const authorCommunity = { id: 12 };
  const post = {
    postId: "1",
    content: "Everything is new",
  };

  beforeEach(() => {
    sinon.stub(jwt, "verify").returns({ data: { user: { ...userProfile } } });
  });

  afterEach(() => {
    jwt.verify.restore();
    sandbox.restore();
  });

  describe("createPost", () => {
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
      assert.throw(query);
      sandbox.assert.calledOnce(getCommunityMemberId);
      sandbox.assert.calledWith(getCommunityMemberId, userProfile.profileId, 10);
      expect(res).to.have.nested.property("errors[0].message");
      expect(res.errors[0].message).to.equal(errorMessage);
      expect(res.errors[0].extensions.code).to.equal("FORBIDDEN");
    });
  });
});
