import { Link } from 'react-router-dom';
import { FaImage, FaLink, FaPen } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';
import { motion } from 'framer-motion';

function CreatePostPrompt() {
  const { user } = useAuthStore();
  const userAvatar = user?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src={userAvatar} 
            alt={user?.username} 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          <Link 
            to="/submit"
            className="flex-1 flex items-center px-4 py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
          >
            <FaPen className="mr-2 text-gray-400" />
            <span className="text-sm sm:text-base">Create Post</span>
          </Link>
          <div className="flex space-x-1 sm:space-x-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/submit?type=image"
                className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all"
                title="Create Image Post"
              >
                <FaImage className="text-lg sm:text-xl" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/submit?type=link"
                className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all"
                title="Create Link Post"
              >
                <FaLink className="text-lg sm:text-xl" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CreatePostPrompt; 