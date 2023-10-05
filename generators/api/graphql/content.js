export const providersGraphqlTsx = `'use client'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
`

export const providersGraphqlJs = `'use client'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
})

export function Providers({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
`

export const providersGraphqlNextuiTsx = `'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <NextUIProvider>{children}</NextUIProvider>
    </ApolloProvider>
  )
}
`
export const providersGraphqlNextuiJs = `'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache(),
})

export function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <NextUIProvider>{children}</NextUIProvider>
    </ApolloProvider>
  )
}
`
