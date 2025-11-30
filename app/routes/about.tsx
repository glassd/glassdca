import type { Route } from "./+types/about";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "About Me" }, { name: "description", content: "Learn more about me." }];
}

export default function About() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Me</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                This is the About page. Content coming soon!
            </p>
        </div>
    );
}
