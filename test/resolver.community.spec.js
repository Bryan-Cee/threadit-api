const { describe, it, afterEach, beforeEach } = require("mocha");
const { assert } = require("chai");
const sinon = require("sinon");
const {
  communities,
  joinCommunity,
  createCommunity,
} = require("../lib/graphql/resolvers/community");
const client = require("../lib/datasource");
const helpers = require("../lib/helpers");
const jwt = require("jsonwebtoken");

describe("Community resolvers", function() {
  const sandbox = sinon.createSandbox();
  const req = { headers: { authorization: "token" } };

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
    const data = {
      count: "2",
      communities: [
        {
          communityId: "1",
          name: "Thread-it",
          description: "The main community every user joins by default",
          founderId: 1,
          createdAt: "11/24/2019, 12:03:00 PM",
          updatedAt: "11/24/2019, 12:03:00 PM"
        },
        {
          communityId: "2",
          name: "dank-memes",
          description: "All dank memers know what it's all about",
          founderId: 2,
          createdAt: "11/24/2019, 12:03:00 PM",
          updatedAt: "11/24/2019, 12:03:00 PM"
        }
      ]
    };
    const founder = {
      userId: "1",
      profileId: "1",
      bio: "A frontend developer Javascript/ReactJS",
      firstSetup: true,
      location: "Nairobi - Kenya",
      username: "ceebryan",
      email: "ceebryan@gmail.com",
      name: "Bryan Cee",
      followers: null,
      avatar: "https://images.unsplash.com/photo-1571101628768-6bae026844b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
    };

    const communityList = sinon.stub(client, "getCommunityList").resolves(data);
    const profileById = sinon.stub(client, "getProfileById").resolves(founder);

    const args = { first: 10, after: 0 };
    const answer = await communities(null, args, { client });

    assert.equal(answer.count, data.count);
    sandbox.assert.calledTwice(profileById);
    sandbox.assert.calledOnce(communityList);
  });

  it("joinCommunity should return a name and description", async function() {
    const communityId = 1;
    const community = { name: "Threadit", description: "Simple and fast" };

    const joinComm = sinon.stub(client, "joinCommunity").resolves(community);
    const res = await joinCommunity(null, { communityId }, { req, client });

    sandbox.assert.calledOnce(joinComm);
    assert.deepEqual(res, community);
  });

  // eslint-disable-next-line max-len
  it("createCommunity should create return the community data", async function() {
    const data = {
      communityId: "1",
      name: "Thread-it",
      description: "The main community every user joins by default",
      founder: {
        userId: "1",
        profileId: "1",
        bio: "A frontend developer Javascript/ReactJS",
        firstSetup: true,
        location: "Nairobi - Kenya",
        username: "ceebryan",
        email: "ceebryan@gmail.com",
        name: "Bryan Cee",
        followers: null,
        avatar: "https://images.unsplash.com/photo-1571101628768-6bae026844b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
      },
      createdAt: "11/24/2019, 12:03:00 PM",
      updatedAt: "11/24/2019, 12:03:00 PM"
    };

    const createComm = sinon.stub(client, "createCommunity").resolves(data);
    const comm = { name: "Bryce", description: "hello" };
    const res = await createCommunity(null, comm, { req, client });

    sandbox.assert.calledOnce(createComm);
    assert.deepEqual(res, data);
  });
});
