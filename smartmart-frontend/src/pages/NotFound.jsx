import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">

      <div className="text-center max-w-lg">

        <div className="text-8xl sm:text-9xl font-black text-blue-600">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h1>

        <p className="text-gray-500 mt-3 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or may
          have been moved.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-7">

          <Link
            to="/"
            className="px-5 py-3 bg-blue-600 text-white
            rounded-lg font-semibold
            hover:bg-blue-700 transition
            flex items-center gap-2"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-3 border border-gray-300
            bg-white text-gray-700 rounded-lg
            font-semibold hover:bg-gray-50 transition
            flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

      </div>

    </div>
  );
}

export default NotFound;