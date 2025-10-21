import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import userResolvers from "./modules/user/user.resolvers";
import userTypeDefs from "./modules/user/user.typeDefs";
import postTypeDefs from "./modules/post/post.typeDefs";
import postResolvers from "./modules/post/post.resolvers";

export const resolvers = mergeResolvers([userResolvers, postResolvers]);
export const typeDefs = mergeTypeDefs([userTypeDefs, postTypeDefs]);
