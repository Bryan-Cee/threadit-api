/* eslint-disable max-len */
const { describe, it } = require("mocha");
const { expect, assert } = require("chai");
const client = require("../../lib/datasource");

describe("Data source", () => {
  describe("createComment", () => {
    it("should return the comment posted", async function() {
      const message = "This is a comment for testing";
      const post = await client.createPost("Testing 123", 1);
      const data = await client.createComment(message, 1, post.postId);
      expect(data).to.have.nested.property("message");
      expect(data.message).equal(message);
      expect(data).to.have.nested.property("postId");
      expect(data).to.have.nested.property("authorId");
    });
  });
  describe("getComments", () => {
    it("should return a comment(s)", async function() {
      const data = await client.getComments(1, 0, 10);
      expect(data).to.have.length(1);
    });
    it("should return two comments as specified in the first param", async function() {
      await client.createComment("Just a simple message", 1, 1);
      const data = await client.getComments(1, 0, 2);
      expect(data).to.have.length(2);
    });
    it("should return an empty list when the post has no comment", async function() {
      const data = await client.getComments(0, 0, 10);
      expect(data).to.have.length(0);
    });
    it("should return the last five comments", async function() {
      for (let i = 0; i < 10; i++) {
        await client.createComment(`A simple message ${i}`, 1, 1);
      }
      const data = await client.getComments(1, 0, 5);
      expect(data).to.have.length(5);
    });
  });
  describe("getCommunityById", () => {
    it("should return the details of a community", async function() {
      const data = await client.getCommunityById(1);
      expect(data).to.have.nested.property("name");
      expect(data).to.have.nested.property("description");
      expect(data).to.have.nested.property("founderId");
    });
    it("should return an empty list if a community does not exist", async function() {
      const data = await client.getCommunityById(13);
      assert.isArray(data, "response from getCommunityById");
      expect(data).to.have.length(0);
    });
  });
});
