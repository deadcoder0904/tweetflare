import ApolloClient from 'apollo-boost'

// Setup ApolloClient
const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000',
  // include auth token with requests made to backend
  fetchOptions: {
    credentials: 'include',
  },
  request: operation => {
    // if no token in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }

    // operation adds the token to an authorization header, wich is sent to the backend

    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token'),
      },
    })
  },
  onError: ({ graphqlErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError)
    }

    if (graphqlErrors) {
      for (let error of graphqlErrors) {
        console.dir('[error]', error)
      }
    }
  },
})

export default apolloClient
