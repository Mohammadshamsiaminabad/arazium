import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import fetch from "cross-fetch";

export const serverClient = new ApolloClient({
  link: new HttpLink({
    uri: "http://192.168.1.2:3000/api/graphql",
    fetch
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
});
