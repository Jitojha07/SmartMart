import { LoaderCircle } from "lucide-react";

function LoadingSpinner({
  text = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}
    >
      <div className="text-center">

        <LoaderCircle
          size={38}
          className="mx-auto text-blue-600 animate-spin"
        />

        <p className="text-gray-500 text-sm mt-3">
          {text}
        </p>

      </div>
    </div>
  );
}

export default LoadingSpinner;