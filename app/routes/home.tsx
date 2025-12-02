import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const apiUrl = new URL("/api/blog?offset=0&limit=3", url).toString();
  const res = await fetch(apiUrl, { headers: { "Cache-Control": "no-store" } });
  if (!res.ok) {
    return Response.json({ posts: [] }, { status: 200 });
  }
  const data = await res.json();
  return data;
}

import { Link, useLoaderData } from "react-router";
import { BlogCard } from "../components/BlogCard";

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const posts = data?.posts ?? [];
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to David Glass's Profile
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          I'm a developer passionate about building great web experiences.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/projects"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg border border-indigo-600 dark:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Contact Me
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Recent Blog Posts
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: any) => (
            <BlogCard
              key={p._id}
              title={p.title}
              slug={p.slug}
              mainImage={p.mainImage}
              tags={p.tags || []}
              snippet={p.snippet}
              publishedAt={p.publishedAt}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            View all posts
          </Link>
        </div>
      </section>
    </div>
  );
}
