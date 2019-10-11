
module.exports = {
  Query: {
    test: async (_, __, { client }) => {
      const result = await client.testQuery();
      return `Hello ${result}`;
    },
  },
};
