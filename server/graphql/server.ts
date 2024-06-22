import { createSchema, createYoga } from 'graphql-yoga'

export const yogaServer = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
    type Query {
      greetings: String
    }
  `,
    resolvers: {
      Query: {
        greetings: () => 'Hello from Yoga in a Bun app!'
      }
    }
  })
})
