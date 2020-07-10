import { rule, shield, allow } from 'graphql-shield';
import { AuthenticationError } from 'apollo-server';

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    if (!ctx.user) return new AuthenticationError("You are not authenticated");
    return true;
  },
)

const permissions = shield({
  Query: {
    currentUser: isAuthenticated,
  },
  Mutation: {
    voteFor: isAuthenticated,
  },
}, { allowExternalErrors: true });

export default permissions;