import { buildSchema } from "graphql";

export const schemas = buildSchema(`
  type Movie {
    id: ID!
    title: String!
    slug: String!
    category: String!
    releasedAt: String!
    description: String!
    imageUrl: String!
  }

  type Review {
    id: ID!
    text: String!
    rating: Int!
    author: User!
  }

  type User {
    id: ID!
    firstName: String!
    avatarUrl: String!
  }

  input UserInput {
    id: ID!
    firstName: String!
    avatarUrl: String!
  }

  input ReviewInput {
    movieId: ID!
    text: String!
    rating: Int!
  }

  type Query {
    reviews(movieId: ID!): [Review!]
  }

  type Mutation {
    addReview(author: UserInput!, reviewInput: ReviewInput!): Review
  }
`);

export type Author = {
  id: string;
  firstName: string;
  avatarUrl: string;
};

export type ReviewInput = {
  movieId: string;
  text: string;
  rating: number;
};

export type Review = {
  id: string;
  author: Author;
  text: string;
  rating: number;
};
