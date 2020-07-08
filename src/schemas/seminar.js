import { gql } from 'apollo-server'

const typeDefs = gql`
  type Seminar {
    id: ID!
    name: String!
    surname: String!
    email: String!
  }

  extend type Query {
    seminars(take:Int, skip:Int): [Seminar]!
    seminarById(id: Int!): Seminar
    seminarByAlumnId(id: Int!): Seminar
  }

  extend type Mutation {
    addSeminar(title: String!, description: String, alumn: Int!): Seminar!
  }
`;

const resolvers = {
  Query: {
    seminars: (parent, { take, skip }, { prisma }) => prisma.seminar.findMany({ skip, take }),
    seminarById: (parent, { id }, { prisma }) => prisma.seminar.findOne({ where: { id } }),
    seminarByAlumnId: (parent, { id }, { prisma }) => prisma.seminar.findOne({ where: { alumn:id } }),
  },
  Mutation: {
    addSeminar: (parent, args, { prisma }) => prisma.seminar.create({
      data: {
        title: args.title,
        description: args.description,
        alumn: args.alumn,
      },
    }),
  }
};

/* export default makeExecutableSchema({
  typeDefs: [typeDefs, alumnTypes],
  resolvers
}); */

export { 
  typeDefs as seminarTypes,
  resolvers as seminarResolvers,
};
