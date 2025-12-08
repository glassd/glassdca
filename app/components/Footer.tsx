import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} David Glass. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="https://github.com/glassd"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">GitHub</span>
              {/* GitHub Icon placeholder */}
              GitHub
            </a>
            <a
              href="https://x.com/daglassd"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Twitter</span>
              {/* Twitter Icon placeholder */}
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/glassd/"
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">LinkedIn</span>
              {/* LinkedIn Icon placeholder */}
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
