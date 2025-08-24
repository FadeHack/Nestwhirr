import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { subnestService } from '../services/subnest.service';
// import { postService } from '../services/post.service';
import { mockSubnestService as subnestService } from '../services/mockServices';
import { mockPostService as postService } from '../services/mockServices';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';

function Subnest() {
  const { subnestName } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const {
    data: subnest,
    error: subnestError,
    status: subnestStatus,
  } = useQuery({
    queryKey: ['subnest', subnestName],
    queryFn: () => subnestService.getSubnest(subnestName),
  });

  const {
    data: posts,
    error: postsError,
    status: postsStatus,
  } = useQuery({
    queryKey: ['subnestPosts', subnestName],
    queryFn: () => postService.getSubnestPosts(subnestName),
  });

  const subscribeMutation = useMutation({
    mutationFn: () => 
      subnest.isSubscribed
        ? subnestService.unsubscribeFromSubnest(subnestName)
        : subnestService.subscribeToSubnest(subnestName),
    onSuccess: () => {
      queryClient.invalidateQueries(['subnest', subnestName]);
    },
  });

  if (subnestStatus === 'pending' || postsStatus === 'pending') {
    return <LoadingSpinner />;
  }

  if (subnestError || postsError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Error: {subnestError?.message || postsError?.message}
        </p>
      </div>
    );
  }

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    subscribeMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Subnest Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="h-32 bg-cyan-500"></div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">n/{subnestName}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {subnest.description}
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-sm">
                  {subnest.memberCount.toLocaleString()} members
                </span>
                <span className="text-sm">
                  {subnest.onlineCount.toLocaleString()} online
                </span>
              </div>
            </div>
            <button
              onClick={handleSubscribe}
              disabled={subscribeMutation.isPending}
              className={`px-4 py-2 rounded-lg ${
                subnest.isSubscribed
                  ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-cyan-500 text-white hover:bg-cyan-600'
              }`}
            >
              {subscribeMutation.isPending
                ? 'Loading...'
                : subnest.isSubscribed
                ? 'Joined'
                : 'Join'}
            </button>
          </div>
        </div>
      </div>

      {/* Create Post Button */}
      <div className="flex justify-end">
        <Link
          to={`/n/${subnestName}/submit`}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Create Post
        </Link>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Subnest; 