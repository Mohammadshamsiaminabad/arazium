import gql from "graphql-tag";

// user
export const GET_PROFILE = gql`
  query GetProfile {
    profile {
      id
      phone_number
      createdAt
    }
  }
`;

// post
export const GET_POSTS = gql`
  query GetPosts($lastPostId: Int) {
    get_posts(lastPostId: $lastPostId) {
      id
      userId
      title
      description
      price
      color
      category
      mark
      main_image
      createdAt
      updatedAt
    }
  }
`

export const GET_POST = gql`
  query GetPost($id: Int) {
    get_post(id: $id) {
      id
      userId
      title
      description
      price
      color
      category
      mark
      main_image
      images {
        path
      }
      createdAt
      updatedAt
      likedBy
      dislikedBy
      savedBy
    }
  }
`;

export const GET_LIKED_POST = gql`
  query GetLikedPosts($lastPostId: Int) {
    get_liked_posts(lastPostId: $lastPostId) {
      posts {
        id
        title
        description
        price
        color
        category
        mark
        main_image
      }
      lastPostId

    }
  }
`;

export const GET_DISLIKED_POSTS = gql`
  query GetDislikedPosts($lastPostId: Int) {
    get_disliked_posts(lastPostId: $lastPostId) {
      posts {
        id
        title
        description
        price
        color
        category
        mark
        main_image
      }
      lastPostId
    }
  }
`;

export const GET_SAVED_POSTS = gql`
  query GetSavedPosts($lastPostId: Int) {
    get_saved_posts(lastPostId: $lastPostId) {
      posts {
        id
        title
        description
        price
        color
        category
        mark
        main_image
      }
      lastPostId
    }
  }
`;