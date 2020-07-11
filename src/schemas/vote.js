import { gql } from 'apollo-server'
import { VoteTwiceError } from '../errors';
import pubsub from '../pubsub';

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

  extend type Subscription {
    voteAdded: Vote
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
      const {id: userId} = user
      const quality = normalizeVotationInt(q)
      const utility = normalizeVotationInt(u)

      const count = await prisma.vote.count({ where: {userId, seminarId} })

      if (count > 0) throw new VoteTwiceError()

      const vote = await prisma.vote.create({
        data: { quality, utility, seminar: { connect: { id: seminarId }}, user: { connect: { id: userId }} },
        include
      })

      pubsub.publish("voteAdded", {
        voteAdded: vote
      });

      return vote
    },
  },

  Subscription: {
    voteAdded: {
      subscribe: () => pubsub.asyncIterator(["voteAdded"])
    }
  }
};

export { 
  typeDefs as voteTypes,
  resolvers as voteResolvers,
};