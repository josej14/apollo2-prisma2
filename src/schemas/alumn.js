import { gql } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = gql`
  type Alumn {
    id: ID!
    name: String!
    surname: String!
    email: String!
  }

  type Query {
    alumns(take:Int, skip:Int): [Alumn]!
    alumnById(id: Int!): Alumn
    alumnByEmail(email: String!): Alumn
  }

  type Mutation {
    addAlumn(name: String!, surname: String!, email: String!): Alumn!
  }
`;

const resolvers = {
  Query: {
    alumns: (parent, { take, skip }, { prisma }) => prisma.alumn.findMany({ skip, take }),
    alumnById: (parent, { id }, { prisma }) => prisma.alumn.findOne({ where: { id } }),
    alumnByEmail: (parent, { email }, { prisma }) => prisma.alumn.findOne({ where: { email } }),
  },
  Mutation: {
    addAlumn: (parent, args, { prisma }) => prisma.alumn.create({
      data: {
        name: args.name,
        surname: args.surname,
        email: args.email,
      },
    }),
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});