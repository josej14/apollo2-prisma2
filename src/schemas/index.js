import { gql } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash/merge';
import { alumnTypes, alumnResolvers } from './alumn';
import { userTypes, userResolvers } from './user'

/*const schema = mergeSchemas({
  schemas: [userSchema, alumnSchema, seminarSchema],
})*/

const typeDefs = gql`
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    ${alumnTypes}
    ${userTypes}
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(
    alumnResolvers,
    userResolvers,
  ),
})

export default schema;
