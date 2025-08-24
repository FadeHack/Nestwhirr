import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockSubnestService as subnestService } from '../../services/mockServices';
import { FaReddit } from 'react-icons/fa';

function PopularCommunities() {
  const { data: subnests, status } = useQuery({
    queryKey: ['popularSubnests'],
    queryFn: subnestService.getSubnests,
  });

  if (status !== 'success') return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
      <div className="space-y-3">
        {subnests.map((subnest) => (
          <Link
            key={subnest.name}
            to={`/n/${subnest.name}`}
            className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FaReddit className="text-cyan-500" />
            </div>
            <div className="ml-3">
              <p className="font-medium">n/{subnest.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subnest.memberCount.toLocaleString()} members
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/subnests"
        className="block mt-4 text-sm text-blue-500 hover:text-blue-600 text-center"
      >
        See All Communities
      </Link>
    </div>
  );
}

export default PopularCommunities; 