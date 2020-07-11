import { gql } from 'apollo-server'
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import pubsub from '../pubsub';

import { WrongCredentialsError } from '../errors';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type LoginResponse {
    token: String
    user: User
  }

  extend type Query {
    currentUser: User!
  }

  extend type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
  }

  extend type Subscription {
    userRegistered: User
    userLogin: User
  }
`;

const resolvers = {
  Query: {
    currentUser: (parent, args, { user, prisma }) => {
      return prisma.user.findOne({ where: { id: user.id } })
    }
  },
  Mutation: {
    register: async (parent, { username, password }, { prisma }) => {
      const hashedPassword = await argon2.hash(password);
      const data = { username, password: hashedPassword };

      const userRegistered = await prisma.user.create({ data });
      pubsub.publish("userRegistered", { userRegistered });
      
      return userRegistered;
    },
    login: async (parent, { username, password }, { prisma }) => {
      const user = await prisma.user.findOne({ where: { username } });
      if (!user) throw new WrongCredentialsError();

      const passwordMatch = await argon2.verify(user.password, password);
      if (!passwordMatch) throw new WrongCredentialsError();

      pubsub.publish("userLogin", { userLogin: user });

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
  },
  Subscription: {
    userLogin: {
      subscribe: () => pubsub.asyncIterator(["userLogin"])
    },
    userRegistered: {
      subscribe: () => pubsub.asyncIterator(["userRegistered"])
    }
  }
};

export { 
  typeDefs as userTypes,
  resolvers as userResolvers,
};