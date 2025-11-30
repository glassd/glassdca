import type { Route } from "./+types/home";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import { Link } from "react-router";

export default function Home() {
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
          {/* Placeholder for blog posts */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Blog Post Title {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A brief summary of the blog post goes here. It should be engaging and give a
                  hint of what's inside.
                </p>
                <Link
                  to={`/blog/post-${i}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/blog" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View all posts</Link>
        </div>
      </section>
    </div>
  );
}
