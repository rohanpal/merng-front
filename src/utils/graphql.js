import gql from "graphql-tag"

export const FETCH_POSTS = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      likeCount
      commentCount
      comments {
        id
        createdAt
        username
        body
      }
    }
  }
`
