import React from "react"
import { createHttpLink } from "apollo-link-http"
import AppoloCient from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { ApolloProvider } from "@apollo/react-hooks"
import App from "./App"
import { setContext } from "apollo-link-context"
import { variables } from "./utils/variables"

const link = createHttpLink({
  uri: "https://hidden-badlands-01849.herokuapp.com/",
})
const authLink = setContext(() => {
  const token = localStorage.getItem(variables.token)
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }
})
const client = new AppoloCient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
