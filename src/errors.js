import {ApolloError} from "apollo-server";

class WrongCredentialsError extends ApolloError {
    constructor(message) {
        super(message || "The provided credentials are invalid", "WRONG_CREDENTIALS");
        Object.defineProperty(this, "name", {value: 'WrongCredentialsError'});
    }
}

class VoteTwiceError extends ApolloError {
  constructor(message) {
      super(message || "A user cannot vote twice for the same seminar", "VOTE_TWICE");
      Object.defineProperty(this, "name", {value: 'VoteTwiceError'});
  }
}

export {
  WrongCredentialsError,
  VoteTwiceError,
}