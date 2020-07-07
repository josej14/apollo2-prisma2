import { mergeSchemas } from 'graphql-tools';

//import bookSchema from './book';
import userSchema from './user'

const schema = mergeSchemas({
  schemas: [userSchema],
})

export default schema;
