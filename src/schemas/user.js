import { gql } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type LoginResponse {
    token: String
    user: User
  }

  type Query {
    currentUser: User!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
  }
`;

const resolvers = {
  Query: {
    currentUser: (parent, args, { user, prisma }) => {
      if (!user) throw new Error('Not authenticated')
      return prisma.user.findOne({ where: { id: user.id } })
    }
  },
  Mutation: {
    register: async (parent, { username, password }, { prisma }) => {
      const hashedPassword = await argon2.hash(password);
      const data = { username, password: hashedPassword };
      return prisma.user.create({ data });
    },
    login: async (parent, { username, password }, { prisma }) => {
      const user = await prisma.user.findOne({ where: { username } });
      if (!user) throw new Error('Invalid username');

      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) throw new Error('Invalid password');

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '30d', // token will expire in 30 days
        },
      );

      return { token, user };

    },
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});