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


function normalizeVotationInt(value) {
  if (value < 0) {
    return 0
  }
  if (value > 10) {
    return 10
  }

  return value
}

const include = {
  seminar: true,
  user: true,
}
const resolvers = {
  Query: {
    votes: (parent, { take, skip }, { prisma }) => prisma.vote.findMany({ skip, take, include }),
    votesByUserId: (parent, { id }, { prisma }) => prisma.vote.findMany({ where: { seminarId: id }, include }),
    votesBySeminarId: (parent, { id }, { prisma }) => prisma.vote.findMany({ where: { userId: id }, include }),
  },
  Mutation: {
    voteFor: async (parent, { seminar: seminarId, quality:q, utility:u }, { prisma, user }) => {
      // obtener userId de contexto
      const {id: userId} = user

      const quality = normalizeVotationInt(q)
      const utility = normalizeVotationInt(u)

      const v = await prisma.vote.findOne({
        where: { userId, seminarId }
      })

      console.log(v)
      console.log('ie')

      return prisma.vote.upsert({
        where: { userId, seminarId },
        update: { quality, utility },
        create: { quality, utility, seminarId, userId },
        include,
      })
    },
  }
};

export { 
  typeDefs as voteTypes,
  resolvers as voteResolvers,
};