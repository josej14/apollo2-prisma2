import { gql } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools';

import merge from 'lodash/merge';
import { alumnTypes, alumnResolvers } from './alumn';
import { seminarTypes, seminarResolvers } from './seminar';
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
    ${seminarTypes}
    ${userTypes}
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: merge(
    alumnResolvers,
    seminarResolvers,
    userResolvers,
  ),
})

export default schema;
