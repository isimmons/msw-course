import { graphql as executeGraphQL } from "graphql";
import { HttpResponse, graphql, http } from "msw";
import { movies } from "./data";
import type { Author, ReviewInput } from "./graphqlSchemas";
import { schemas } from "./graphqlSchemas";

const customerService = graphql.link("https://api.example.com/review-service");

export const handlers = [
  http.get("https://api.example.com/movies/featured", () => {
    return HttpResponse.json(movies);
  }),

  http.get("https://api.example.com/movies/:slug", ({ params }) => {
    const { slug } = params;

    const movie = movies.find((movie) => {
      return movie.slug === slug;
    });

    if (!movie) return new HttpResponse("Not found", { status: 404 });

    return HttpResponse.json(movie);
  }),

  http.get("/api/recommendations", async ({ request }) => {
    const url = new URL(request.url);
    const movieId = url.searchParams.get("movieId");

    if (!movieId)
      return HttpResponse.json(
        { error: 'Missing query parameter "movieId' },
        { status: 400 }
      );

    const recommendations = movies.filter((m) => m.id !== movieId);

    return HttpResponse.json(recommendations.slice(0, 2));
  }),

  http.post("https://auth.provider.com/authenticate", async ({ request }) => {
    const data = await request.formData();
    const email = data.get("email");
    const password = data.get("password");

    // server side validate
    if (!email || !password) return new HttpResponse(null, { status: 400 });

    // simulate auth passed and response returned
    return HttpResponse.json({
      id: "2b225b31-904a-443b-a898-a280fa8e0356",
      email,
      firstName: "John",
      lastName: "Maverick",
      avatarUrl: "https://i.pravatar.cc/100?img=12",
    });
  }),

  customerService.query("ListReviews", () => {
    return HttpResponse.json({
      data: {
        serviceReviews: [
          {
            id: "04be0fb5-19f6-411c-9257-bcef6cd203c2",
            message: "Hello World",
          },
        ],
      },
    });
  }),

  graphql.operation(async ({ query, variables }) => {
    const { errors, data } = await executeGraphQL({
      schema: schemas,
      source: query,
      variableValues: variables,
      rootValue: {
        reviews(args: { movieId: string }) {
          const movie = movies.find((movie) => {
            return movie.id === args.movieId;
          });

          if (!movie) {
            throw new Error(`Cannot find a movie by ID "${args.movieId}"`);
          }

          return movie?.reviews || [];
        },
        addReview(args: { author: Author; reviewInput: ReviewInput }) {
          const { author, reviewInput } = args;
          const { movieId, ...review } = reviewInput;

          const movie = movies.find((movie) => {
            return movie.id === movieId;
          });

          if (!movie) {
            throw new Error(`Cannot find a movie by ID "${movieId}"`);
          }

          const newReview = {
            ...review,
            id: Math.random().toString(16).slice(2),
            author,
          };

          const prevReviews = movie.reviews || [];
          movie.reviews = prevReviews.concat(newReview);

          return newReview;
        },
      },
    });

    return HttpResponse.json({ errors, data });
  }),
];
