/* eslint-disable max-len */
const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert } = require("chai");
const sinon = require("sinon");
const { createTestClient } = require("apollo-server-testing");
const client = require("../../lib/datasource");
const helpers = require("../../lib/helpers");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server");
const { config } = require("../../lib/graphql");
const fixtures = require("../fixtures/data");
const g = require("../fixtures/gql");

function createTestSever(context) {
  const _config = { ...config, context };
  const server = new ApolloServer(_config);
  return { server };
}

describe("Queries", function() {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sinon.stub(jwt, "verify").returns({ data: { userId: 1 } });
    sinon.stub(helpers, "isAuthenticated");
  });

  afterEach(() => {
    jwt.verify.restore();
    helpers.isAuthenticated.restore();
    sandbox.restore();
  });

  it("communities should return a list of communities", async function() {
    const founder = {
      userId: "1",
      profileId: "1",
      username: "ceebryan",
      email: "ceebryan@gmail.com",
    };

    const communityList = sinon.stub(client, "getCommunityList").returns(fixtures.communityListData);
    const profileById = sinon.stub(client, "getProfileById").returns(founder);

    const args = { first: 10, after: 0 };
    const { server } = createTestSever({ client });
    const { query } = createTestClient(server);
    // Run the query
    const res = await query({
      query: g.GET_COMMUNITIES,
      variable: args,
    });
    communityList.restore();
    profileById.restore();

    assert.deepEqual(res.data.communities, fixtures.communityListData);
  });
});
