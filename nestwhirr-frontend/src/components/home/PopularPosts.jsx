import { Link } from 'react-router-dom';
import { FaArrowUp, FaComment, FaShare, FaReddit, FaArrowRight } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { mockPostService as postService } from '../../services/mockServices';
import LoadingSpinner from '../common/LoadingSpinner';
import { motion } from 'framer-motion';

function PopularPostCard({ title, subnest, upvotes, comments, thumbnail, excerpt }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {thumbnail && (
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${thumbnail})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center"
            >
              <FaReddit className="text-cyan-500 text-xl" />
            </motion.div>
            <Link 
              to={`/n/${subnest}`} 
              className="text-sm font-medium hover:text-cyan-500 transition-colors"
            >
              n/{subnest}
            </Link>
          </div>
          
          <Link to={`/n/${subnest}/comments/1`} className="block group">
            <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
              {title}
            </h3>
            {excerpt && (
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {excerpt}
              </p>
            )}
          </Link>

          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-1.5 hover:text-cyan-500 transition-colors"
            >
              <FaArrowUp />
              <span>{upvotes.toLocaleString()}</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-1.5 hover:text-cyan-500 transition-colors"
            >
              <FaComment />
              <span>{comments.toLocaleString()}</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-1.5 hover:text-cyan-500 transition-colors"
            >
              <FaShare />
              <span>Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PopularPosts() {
  const { data: popularPosts, status } = useQuery({
    queryKey: ['popularPosts'],
    queryFn: () => postService.getPopularPosts(),
  });

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <p className="text-red-500 dark:text-red-400">
          Failed to load popular posts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Popular Posts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            See what's capturing the community's attention
          </p>
        </div>
        <Link 
          to="/popular"
          className="group flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 font-medium"
        >
          <span>View All</span>
          <motion.div
            whileHover={{ x: 4 }}
            className="transition-transform"
          >
            <FaArrowRight className="text-sm" />
          </motion.div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid gap-6"
      >
        {popularPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PopularPostCard {...post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default PopularPosts; 