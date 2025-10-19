import gql from "graphql-tag";

// user
export const REGISTER_USER = gql`
  mutation RegisterUser($phone_number: String!, $password: String!) {
    register(phone_number: $phone_number, password: $password)
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($phone_number: String!, $password: String!) {
    login(phone_number: $phone_number, password: $password)
  }
`;

// post
export const ADD_POST = gql`
  mutation AddPost($input: PostInput!) {
    add_post(input: $input)
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    delete_post(id: $id)
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: Int!, $input: UpdatePostInput!) {
    update_post(id: $id, input: $input)
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($id: Int!) {
    like_post(id: $id)
  }
`;

export const UNLIKE_POST = gql`
  mutation UnLikePost($id: Int!) {
    unlike_post(id: $id)
  }
`;

export const DISLIKE_POST = gql`
  mutation DislikePost($id: Int!) {
    dislike_post(id: $id)
  }
`;

export const UNDISLIKE_POST = gql`
  mutation UnDislikePost($id: Int!) {
    undislike_post(id: $id)
  }
`;

export const SAVE_POST = gql`
  mutation SavePost($id: Int!) {
    save_post(id: $id)
  }
`;

export const UNSAVE_POST = gql`
  mutation UnSavePost($id: Int!) {
    unsave_post(id: $id)
  }
`;

