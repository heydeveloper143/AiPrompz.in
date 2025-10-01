// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        {/* Site Name */}
        <Link
          href="/"
          className="text-2xl font-extrabold text-gray-900 hover:text-blue-600 transition"
        >
          AI Gemini Prompts
        </Link>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-gray-700 text-sm md:text-base">
          <Link
            href="/"
            className="relative group"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/contact"
            className="relative group"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/admin"
            className="ml-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Admin
          </Link>

          <Link
            href="/privacy-policy"
            className="relative group text-gray-500"
          >
            Privacy Policy
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>

          <Link
            href="/terms-of-service"
            className="relative group text-gray-500"
          >
            Terms of Service
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
