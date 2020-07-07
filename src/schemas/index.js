import { mergeSchemas } from 'graphql-tools';

import alumnSchema from './alumn';
import userSchema from './user'

const schema = mergeSchemas({
  schemas: [userSchema, alumnSchema],
})

export default schema;
