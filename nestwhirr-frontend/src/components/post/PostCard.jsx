import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowUp, FaArrowDown, FaComments } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../../services/post.service';
import useAuthStore from '../../store/authStore';

function PostCard({ post }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const voteMutation = useMutation({
    mutationFn: ({ postId, voteType }) => postService.votePost(postId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  const handleVote = (voteType) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    voteMutation.mutate({ postId: post.id, voteType });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Vote buttons */}
      <div className="flex">
        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-l-lg">
          <button
            onClick={() => handleVote('up')}
            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
              post.userVote === 'up' ? 'text-cyan-500' : ''
            }`}
          >
            <FaArrowUp />
          </button>
          <span className="my-1 font-medium">{post.score}</span>
          <button
            onClick={() => handleVote('down')}
            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
              post.userVote === 'down' ? 'text-blue-500' : ''
            }`}
          >
            <FaArrowDown />
          </button>
        </div>

        {/* Post content */}
        <div className="flex-1 p-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Link
              to={`/n/${post.subnest}`}
              className="font-medium text-blue-500 hover:underline mr-2"
            >
              n/{post.subnest}
            </Link>
            <span className="mx-1">•</span>
            <span>Posted by</span>
            <Link
              to={`/user/${post.author}`}
              className="hover:underline mx-1"
            >
              u/{post.author}
            </Link>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>

          <Link
            to={`/n/${post.subnest}/post/${post.id}`}
            className="block group"
          >
            <h2 className="text-xl font-medium mb-2 group-hover:text-cyan-500">
              {post.title}
            </h2>
            {post.content && (
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {post.content}
              </p>
            )}
          </Link>

          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Link
              to={`/n/${post.subnest}/post/${post.id}`}
              className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1"
            >
              <FaComments className="mr-2" />
              {post.commentCount} comments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard; 