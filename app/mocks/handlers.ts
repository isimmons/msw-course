import { http, HttpResponse, delay } from "msw";
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

    // delay can be used to simulate slow network, slow server responses
    // accepts time in ms, mode ('real', 'infinite') or no args
    // 'real' and no args default to a random realistic response time
    await delay(2000);

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

  // authentication mock
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
];
