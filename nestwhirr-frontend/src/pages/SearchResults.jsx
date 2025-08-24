import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockPostService as postService } from '../services/mockServices';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const {
    data: posts,
    error,
    status,
  } = useQuery({
    queryKey: ['search', query],
    queryFn: () => postService.searchPosts(query),
    enabled: !!query,
  });

  if (status === 'pending') return <LoadingSpinner />;

  if (status === 'error') {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">
        Search results for "{query}"
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No results found for "{query}"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults; 