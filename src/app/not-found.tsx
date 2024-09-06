import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="mt-2 text-xl">Page Not Found</p>
        <p className="mt-4">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" passHref>
          <span className="mt-6 inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600">
            Go Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
}
