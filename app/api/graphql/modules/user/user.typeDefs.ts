import { gql } from "graphql-tag";

export default gql`
  type User {
    id: String!
    phone_number: String!
    createdAt: String!
  }

  type Query {
    profile: User!
  }

  type Mutation {
    register(phone_number: String!, password: String!): Boolean
    login(phone_number: String!, password: String!): Boolean
  }
`;