import { http } from "msw";
import { movies } from "./data";

export const handlers = [
  http.get("https://api.example.com/movies/featured", () => {
    return new Response(JSON.stringify(movies), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];
