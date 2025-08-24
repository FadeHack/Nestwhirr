import { Link } from 'react-router-dom';
import { FaRocket, FaGamepad, FaTv, FaPalette, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

function TrendingCommunityCard({ icon: Icon, name, description, members, color, banner }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link 
        to={`/n/${name}`}
        className="block relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        {/* Banner Image with Gradient Overlay */}
        <div 
          className="h-28 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `linear-gradient(45deg, ${color}88, ${color}cc)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
          
          {/* Community Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className={`absolute -bottom-6 left-4 w-14 h-14 ${color} rounded-2xl flex items-center justify-center transform rotate-3 border-4 border-white dark:border-gray-800 shadow-lg`}
          >
            <Icon className="text-white text-xl transform -rotate-3" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 pt-8">
          <div className="mb-2">
            <h3 className="font-bold text-lg">n/{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {members.toLocaleString()} members
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Join
            </motion.button>
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              className="text-gray-400 dark:text-gray-500"
            >
              <FaArrowRight />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TrendingCommunities() {
  const trendingCommunities = [
    {
      icon: FaGamepad,
      name: 'gaming',
      description: 'The pulse of the gaming world. News, reviews, memes, and more!',
      members: 32500000,
      color: 'bg-purple-500',
      banner: '/banners/gaming.jpg'
    },
    {
      icon: FaTv,
      name: 'television',
      description: 'Discuss your favorite shows, share theories, and stay updated on the latest episodes.',
      members: 18900000,
      color: 'bg-blue-500',
      banner: '/banners/tv.jpg'
    },
    {
      icon: FaPalette,
      name: 'art',
      description: 'A community for artists and art lovers. Share your work, get feedback, find inspiration.',
      members: 15600000,
      color: 'bg-pink-500',
      banner: '/banners/art.jpg'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Trending Communities</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join vibrant communities growing right now
          </p>
        </div>
        <Link 
          to="/trending"
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
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {trendingCommunities.map((community, index) => (
          <motion.div
            key={community.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TrendingCommunityCard {...community} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default TrendingCommunities; 