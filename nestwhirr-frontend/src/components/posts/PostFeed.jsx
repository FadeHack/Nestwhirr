import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

// Mock service for now - replace with actual API call
const fetchPosts = async ({ pageParam = 1 }) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const posts = Array(10).fill(null).map((_, i) => ({
    id: `${pageParam}-${i}`,
    title: `Post ${pageParam}-${i}`,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author: 'user123',
    subnest: 'programming',
    score: Math.floor(Math.random() * 10000),
    commentCount: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    thumbnail: Math.random() > 0.5 ? `https://picsum.photos/400/300?random=${pageParam}-${i}` : null,
  }));

  return {
    posts,
    nextPage: pageParam + 1,
    hasMore: pageParam < 5, // Limit to 5 pages for demo
  };
};

function PostCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex">
        {/* Vote buttons */}
        <div className="flex flex-col items-center px-2 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-l-xl">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="p-1.5 text-gray-400 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all"
          >
            <FaArrowUp />
          </motion.button>
          <span className="text-sm font-medium my-1">{post.score.toLocaleString()}</span>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all"
          >
            <FaArrowDown />
          </motion.button>
        </div>

        {/* Post content */}
        <div className="flex-1 p-4">
          {/* Post header */}
          <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <Link to={`/n/${post.subnest}`} className="font-medium hover:text-cyan-500 transition-colors">
              n/{post.subnest}
            </Link>
            <span className="mx-1.5">•</span>
            <span className="hidden xs:inline">Posted by</span>
            <Link to={`/u/${post.author}`} className="ml-1 hover:text-cyan-500 transition-colors">
              u/{post.author}
            </Link>
            <span className="mx-1.5">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Post title */}
          <Link to={`/n/${post.subnest}/comments/${post.id}`} className="block group">
            <h2 className="text-lg font-medium mb-2 group-hover:text-cyan-500 transition-colors">
              {post.title}
            </h2>
          </Link>

          {/* Post thumbnail */}
          {post.thumbnail && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <motion.img 
                whileHover={{ scale: 1.02 }}
                src={post.thumbnail} 
                alt={post.title}
                className="w-full max-h-96 object-cover transition-transform"
                loading="lazy"
              />
            </div>
          )}

          {/* Post preview */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">
            {post.content}
          </p>

          {/* Post actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-500 dark:text-gray-400">
            <Link 
              to={`/n/${post.subnest}/comments/${post.id}`}
              className="flex items-center space-x-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-3 py-1.5 transition-all group"
            >
              <FaComment className="group-hover:text-cyan-500 transition-colors" />
              <span className="text-sm">{post.commentCount.toLocaleString()}</span>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-3 py-1.5 transition-all group"
            >
              <FaShare className="group-hover:text-cyan-500 transition-colors" />
              <span className="text-sm hidden xs:inline">Share</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-3 py-1.5 transition-all group"
            >
              <FaBookmark className="group-hover:text-cyan-500 transition-colors" />
              <span className="text-sm hidden xs:inline">Save</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PostFeed() {
  const { ref, inView } = useInView();
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center"
      >
        <p className="text-red-500 dark:text-red-400">Error: {error.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {data.pages.map((page, i) => (
          <div key={i} className="space-y-4">
            {page.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ))}
      </AnimatePresence>

      <div ref={ref} className="py-4">
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <LoadingSpinner />
          </motion.div>
        )}
        
        {!hasNextPage && data.pages[0]?.posts?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You've reached the end of your feed
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default PostFeed; 