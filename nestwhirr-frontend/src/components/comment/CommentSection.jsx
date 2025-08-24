import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaReply, FaEllipsisH } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../../services/post.service';
import useAuthStore from '../../store/authStore';

function Comment({ comment, postId, depth = 0 }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const isAuthor = user?.username === comment.author;

  const voteMutation = useMutation({
    mutationFn: ({ commentId, voteType }) =>
      postService.voteComment(postId, commentId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  const handleVote = (voteType) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    voteMutation.mutate({ commentId: comment.id, voteType });
  };

  return (
    <div 
      className={`flex space-x-3 p-4 ${depth > 0 ? 'border-l-2 dark:border-gray-700 ml-4' : ''}`}
      style={{ marginLeft: `${depth * 1}rem` }}
    >
      {/* Author Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-sm font-medium">
            {comment.author[0].toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {/* Comment Header */}
        <div className="flex items-center space-x-2 text-sm">
          <Link
            to={`/user/${comment.author}`}
            className={`font-medium hover:underline ${isAuthor ? 'text-cyan-500' : ''}`}
          >
            u/{comment.author}
          </Link>
          {isAuthor && (
            <span className="px-1.5 py-0.5 text-xs bg-cyan-100 dark:bg-cyan-900 text-cyan-500 rounded-full">
              OP
            </span>
          )}
          <span className="text-gray-500 dark:text-gray-400">•</span>
          <span className="text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt))} ago
          </span>
        </div>

        {/* Comment Content */}
        <div className="text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none">
          {comment.content}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          {/* Vote Buttons */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
            <button
              onClick={() => handleVote('up')}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                comment.userVote === 'up' ? 'text-cyan-500' : ''
              }`}
            >
              <FaArrowUp className="text-xs" />
            </button>
            <span className={`text-xs font-medium ${
              comment.userVote === 'up' ? 'text-cyan-500' : 
              comment.userVote === 'down' ? 'text-blue-500' : ''
            }`}>
              {comment.score}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                comment.userVote === 'down' ? 'text-blue-500' : ''
              }`}
            >
              <FaArrowDown className="text-xs" />
            </button>
          </div>

          <button className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-2 py-1">
            <FaReply className="text-xs" />
            <span>Reply</span>
          </button>

          <button className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-2 py-1">
            <FaEllipsisH className="text-xs" />
            <span>More</span>
          </button>
        </div>

        {/* Nested Comments */}
        {comment.replies?.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                postId={postId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CommentSection({ comments, postId }) {
  return (
    <div className="divide-y dark:divide-gray-700">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}

export default CommentSection; 