import type { Route } from "./+types/contact";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Contact Me" }, { name: "description", content: "Get in touch with me." }];
}

export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Contact Me</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                This is the Contact page. Form coming soon!
            </p>
        </div>
    );
}
