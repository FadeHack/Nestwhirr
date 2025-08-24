import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-cyan-500 mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound; 