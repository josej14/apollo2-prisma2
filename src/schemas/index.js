import { gql } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash/merge';
import { alumnTypes, alumnResolvers } from './alumn';
import { userTypes, userResolvers } from './user'
import { voteTypes, voteResolvers } from './vote'

const typeDefs = gql`
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    ${alumnTypes}
    ${userTypes}
    ${voteTypes}
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(
    alumnResolvers,
    userResolvers,
    voteResolvers,
  ),
})

export default schema;
