import useAuthStore from '../store/authStore';
import HeroSection from '../components/home/HeroSection';
import TrendingCommunities from '../components/home/TrendingCommunities';
import PopularPosts from '../components/home/PopularPosts';
import PostFeed from '../components/posts/PostFeed';
import CreatePostPrompt from '../components/posts/CreatePostPrompt';
import SortBar from '../components/posts/SortBar';
import TopCommunities from '../components/sidebar/TopCommunities';
import { motion } from 'framer-motion';

function LoggedOutHome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TrendingCommunities />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PopularPosts />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoggedInHome() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      {/* Create Post - Always at top for both mobile and desktop */}
      <div className="max-w-6xl mx-auto mb-6">
        <CreatePostPrompt />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-w-0"
        >
          <div className="space-y-4">
            <SortBar />
            <PostFeed />
          </div>
        </motion.div>

        {/* Right Sidebar - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-80 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-16 space-y-4">
            <TopCommunities />
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <a href="#" className="text-cyan-500 hover:underline">Help</a>
                <a href="#" className="text-cyan-500 hover:underline">About</a>
                <a href="#" className="text-cyan-500 hover:underline">Blog</a>
                <a href="#" className="text-cyan-500 hover:underline">Careers</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile-only sections - Shown below posts */}
        <div className="lg:hidden w-full space-y-4 mt-6">
          <TopCommunities />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
          >
            <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="#" className="text-cyan-500 hover:underline">Help</a>
              <a href="#" className="text-cyan-500 hover:underline">About</a>
              <a href="#" className="text-cyan-500 hover:underline">Blog</a>
              <a href="#" className="text-cyan-500 hover:underline">Careers</a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function Home() {
  const { isAuthenticated, user } = useAuthStore();

  // Loading state
  if (isAuthenticated && !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your feed...</p>
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? <LoggedInHome /> : <LoggedOutHome />;
}

export default Home;