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
      }
  `,
  GET_PROFILE: gql`
      query getProfile($id: ID!){
          getProfile(id: $id){
              userId
              profileId
              name
              username
              email
              avatar
              bio
              location
              firstSetup
              followers
              createdAt
              updatedAt
          }
      }
  `,
  CREATE_COMMUNITY: gql`
      mutation createCommunity($name: String!, $description: String){
          createCommunity(name: $name, description: $description){
              communityId
              name
              description
              founder{
                  userId
                  profileId
                  username
                  email
              }
              createdAt
              updatedAt
          }
      }
  `,
  JOIN_COMMUNITY: gql`
      mutation joinCommunity($communityId: ID!){
          joinCommunity(communityId: $communityId){
              description
              name
          }
      }
  `,
  GET_COMMENTS: gql`
      query comments($postId: ID!, $after: Int, $first: Int){
          comments(postId: $postId, after: $after, first: $first){
              authorId
              commentId
              message
          }
      }
  `,
};

