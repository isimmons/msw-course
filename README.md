# Starting Commit

For the course starting point I created a new updated remix project and copied over the routes/ui from Artem's starting project for the course.

There are some code changes due to changes in the latest remix version.

Also react-icons all icons cause error "React does not recognize dataSlot" which is an attribute on the svgs. Changing it to dataslot myself in the package did not make a difference so after a while trying to solve the issue, I just removed react-icons and replaced it with @remixicon/react.

There are probably still some issues but currently I am only getting errors that (as far as I can tell) are caused by the fact that we havn't started implementing api mock handlers yet.

## Error Boundary Hydration Issue

The error thrown by the server side for the fail to fetch is named FetchError but on the client it changes to Error. This causes a hydration mismatch. Until fixed correctly, I replaced error.name with "Error" in text (see errorBanner.tsx)

Changed back to error.name because the problem disapeared. It has been a buggy experience with errors where one error fix causes a new completely unrelated error to pop up because the application was able to go further before hitting the next error. Thus is the experience when you go all off track and update everything all at once :-)

## Code Saves

Saving the api/recommendations mock so I can clean up in the handlers file

```js
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
```

## Graphql ?

I don't know graphql but apparently have intercepted a graphql request and mocked the response. Guess I need to go learn some graphql...
