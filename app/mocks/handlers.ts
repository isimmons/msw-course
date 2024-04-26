import { http, graphql, HttpResponse } from "msw";
import { movies } from "./data";

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

  /**
  query ListReviews($movieId: ID!) {
      reviews(movieId: $movieId) {
        id
        text
        rating
        author {
          firstName
          avatarUrl
        }
      }
    }
   */
  graphql.query("ListReviews", ({ variables }) => {
    const { movieId } = variables;
    const movie = movies.find((m) => m.id === movieId);

    const reviews = movie?.reviews || [];

    return HttpResponse.json({
      data: {
        reviews,
      },
    });
  }),

  /**
  mutation AddReview($author: UserInput!, $reviewInput: ReviewInput!) {
    addReview(author: $author, reviewInput: $reviewInput) {
      id
      text
      author {
        id
        firstName
        avatarUrl
      }
    }
  }
   */
  graphql.mutation("AddReview", ({ variables }) => {
    const { author, reviewInput } = variables;
    const { movieId, ...review } = reviewInput;
    const movie = movies.find((m) => m.id === movieId);

    if (!movie)
      return HttpResponse.json({ errors: [{ message: "Movie not found " }] });

    const newReview = {
      ...review,
      id: Math.random().toString(16).slice(2),
      author,
    };

    const prevReviews = movie.reviews || [];

    movie.reviews = prevReviews.concat(newReview);

    return HttpResponse.json({
      data: {
        addReview: newReview,
      },
    });
  }),
];
