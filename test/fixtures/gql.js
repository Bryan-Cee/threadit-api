const { gql } = require("apollo-server");

module.exports = {
  GET_COMMUNITIES: gql`
      query getCommunities($after: Int, $first: Int){
          communities(after: $after, first: $first){
              count
              communities{
                  communityId
                  name
                  createdAt
                  description
                  updatedAt
                  founder{
                      userId
                      profileId
                      username
                      email
                  }
              }
          }
      }
  `,
  LOGIN: gql`
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
  `,
  CREATE_POST: gql`
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
                      userId
                      profileId
                      username
                      email
                  }
                  description
              }
              createdAt
              updatedAt
        }
    }`,
};

