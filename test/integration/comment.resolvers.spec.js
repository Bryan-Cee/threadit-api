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

describe("Comment resolvers", function() {
  const sandbox = sinon.createSandbox();
  const config = { client, req: { headers: { authorization: "token" } } };
  const user = { userId: 1 };

  beforeEach(() => {
    sinon.stub(jwt, "verify").returns({ data: user });
    sinon.stub(helpers, "isAuthenticated");
  });

  afterEach(() => {
    jwt.verify.restore();
    helpers.isAuthenticated.restore();
    sandbox.restore();
  });

  describe("comments", () => {
    it("should return a list of comments", async function() {
      const args = { postId: "1", after: 0, first: 2 };
      const getComments = sinon.stub(client, "getComments").returns(fixtures.comments);

      // Create the test server
      const { query } = createTestSever(config);

      // Run the query
      const res = await query({
        query: g.GET_COMMENTS,
        variables: args,
      });

      // Restore mocked functions
      getComments.restore();

      sinon.assert.calledWith(getComments, args.postId, args.after, args.first);
      expect(res).to.have.nested.property("data.comments");
      assert.deepEqual(res.data.comments, fixtures.comments);
    });
  });
});
