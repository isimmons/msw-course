import { http, HttpResponse } from "msw";
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

  http.get("/api/recommendations", ({ request }) => {
    const url = new URL(request.url);
    const movieId = url.searchParams.get("movieId");

    // simulate network error, rejects with no status
    // not the same as a server side error
    // return HttpResponse.error();

    if (!movieId)
      return HttpResponse.json(
        { error: 'Missing query parameter "movieId' },
        { status: 400 }
      );

    // simulate error for shawshank recommendations
    // if (movieId === "8061539f-f0d6-4187-843f-a25aadf948eb")
    //   return new HttpResponse(null, { status: 500 });

    const recommendations = movies.filter((m) => m.id !== movieId);

    return HttpResponse.json(recommendations.slice(0, 2));
  }),
];
