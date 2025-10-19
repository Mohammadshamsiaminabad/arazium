"use client";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";

export const client = new ApolloClient({
  link: new HttpLink({ 
    uri: "/api/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function LayoutWrapper({children}: { children: ReactNode }) {
  return (
    <ApolloProvider  client={client}>
      {children}
    </ApolloProvider>
  )
}