import { gql } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools';

const typeDefs = gql`
  type Alumn {
    id: ID!
    name: String!
    surname: String!
    email: String!
    seminar: Seminar!
  }

  type Seminar {
    id: ID!
    title: String!
    description: String!
    alumn: Alumn!
  }

  extend type Query {
    alumns(take:Int, skip:Int): [Alumn]!
    alumnById(id: Int!): Alumn
    alumnByEmail(email: String!): Alumn
  }
`;

const resolvers = {
  Query: {
    alumns: (parent, { take, skip }, { prisma }) => prisma.alumn.findMany({ skip, take }),
    alumnById: (parent, { id }, { prisma }) => prisma.alumn.findOne({ where: { id } }),
    alumnByEmail: (parent, { email }, { prisma }) => prisma.alumn.findOne({ where: { email } }),
  }
};

export { 
  typeDefs as alumnTypes,
  resolvers as alumnResolvers,
};