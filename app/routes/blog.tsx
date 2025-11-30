import type { Route } from "./+types/blog";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Blog" }, { name: "description", content: "Read my latest blog posts." }];
}

export default function Blog() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Blog</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                This is the Blog page. Posts coming soon!
            </p>
        </div>
    );
}
