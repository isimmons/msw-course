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

    const recommendations = movies.filter((m) => m.id !== movieId);

    return HttpResponse.json(recommendations.slice(0, 2));
  }),
];
