import { type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Series - Movies App" }];
};

export default function SeriesPage() {
  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-10">TV Series</h2>
      <p className="text-neutral-400">
        Apply what you learn from this course to implement a &ldquo;TV
        Series&rdquo; page how you see fit!
      </p>
    </div>
  );
}
