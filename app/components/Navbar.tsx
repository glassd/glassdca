import { Link, NavLink } from "react-router";

export function Navbar() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
              >
                <img
                  src="/logo.png"
                  alt="Glass D. Logo"
                  className="h-8 w-8 rounded-full"
                />
                <span>David Glass</span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-indigo-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          {/* Mobile menu button placeholder - can be expanded later */}
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Add mobile menu toggle here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
}
