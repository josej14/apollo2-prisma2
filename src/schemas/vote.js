import { gql } from 'apollo-server'

const typeDefs = gql`
  type Vote {
    id: ID!
    quality: Int!
    utility: Int!
    seminar: Seminar
    user: User
  }

  extend type Query {
    votes(take:Int, skip:Int): [Vote]
    votesByUserId(id: Int!): [Vote]
    votesBySeminarId(id: Int!): [Vote]
  }

  extend type Mutation {
    voteFor(seminar: Int!, quality: Int!, utility: Int!): Vote!
  }
`;


const include = {
  seminar: true,
  user: true,
}
const resolvers = {
  Query: {
    votes: (parent, { take, skip }, { prisma }) => prisma.vote.findMany({ skip, take, include }),
    votesByUserId: (parent, { id }, { prisma }) => prisma.vote.findMany({ where: { seminar: id }, include }),
    votesBySeminarId: (parent, { id }, { prisma }) => prisma.vote.findMany({ where: { user: id }, include }),
  },
  Mutation: {
    voteFor: async (parent, { seminar, quality, utility }, { prisma }) => {
      // obtener userId de contexto

      // quality y utility entre 0 y 10
      // create or update de vote

      // return vote

    },
  }
};

export { 
  typeDefs as voteTypes,
  resolvers as voteResolvers,
};