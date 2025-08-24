import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { postService } from '../services/post.service';
import { mockPostService as postService } from '../services/mockServices';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PostCard from '../components/post/PostCard';
import CommentSection from '../components/comment/CommentSection';
import useAuthStore from '../store/authStore';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';
import { FaReddit } from 'react-icons/fa';

function Post() {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [comment, setComment] = useState('');

  const {
    data: post,
    error: postError,
    status: postStatus,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postService.getPost(postId),
  });

  const {
    data: comments,
    error: commentsError,
    status: commentsStatus,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postService.getComments(postId),
  });

  const createCommentMutation = useMutation({
    mutationFn: (content) => postService.createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setComment('');
    },
  });

  if (postStatus === 'pending' || commentsStatus === 'pending') {
    return <LoadingSpinner />;
  }

  if (postError || commentsError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Error: {postError?.message || commentsError?.message}
        </p>
      </div>
    );
  }

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createCommentMutation.mutate(comment);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Post Header */}
        <div className="border-b dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FaReddit className="text-cyan-500 text-xl mr-2" />
              <span className="font-medium hover:underline">
                n/{post.subnest}
              </span>
            </div>
            <span>•</span>
            <span>Posted by u/{post.author}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <PostCard post={post} isFullPost />
        </div>

        {/* Comment Form */}
        {isAuthenticated ? (
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-sm font-medium">{user?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Comment as {user?.username}
              </span>
            </div>
            <form onSubmit={handleSubmitComment}>
              <TextareaAutosize
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What are your thoughts?"
                minRows={4}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={createCommentMutation.isPending || !comment.trim()}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createCommentMutation.isPending ? 'Commenting...' : 'Comment'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Please{' '}
              <a href="/login" className="text-cyan-500 hover:underline">
                log in
              </a>{' '}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t dark:border-gray-700">
          <div className="p-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <span>Comments</span>
              <span className="text-gray-500 dark:text-gray-400">
                ({comments.length})
              </span>
            </h2>
          </div>
          <div className="divide-y dark:divide-gray-700">
            <CommentSection comments={comments} postId={postId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post; 