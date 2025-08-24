import { useState } from 'react';
import { FaFire, FaRocket, FaStar, FaClock, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function SortButton({ icon: Icon, label, isActive, onClick, showLabel = true }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center justify-center w-full px-3 sm:px-4 py-2.5 rounded-xl transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}
    >
      <Icon className={`text-lg ${isActive ? 'animate-pulse' : ''}`} />
      {showLabel && (
        <span className={`text-sm ml-2 font-medium ${isActive ? '' : 'text-gray-600 dark:text-gray-300'}`}>
          {label}
        </span>
      )}
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}

function ViewOptions({ activeView, onViewChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const views = ['Card', 'Compact', 'Classic'];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all"
      >
        <span className="font-medium">{activeView} View</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-sm" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50"
          >
            {views.map((view) => (
              <motion.button
                key={view}
                whileHover={{ x: 4 }}
                onClick={() => {
                  onViewChange(view);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  activeView === view
                    ? 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {view} View
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortBar() {
  const [activeSort, setActiveSort] = useState('hot');
  const [activeView, setActiveView] = useState('Card');

  const sortOptions = [
    { icon: FaFire, label: 'Hot', value: 'hot' },
    { icon: FaRocket, label: 'New', value: 'new' },
    { icon: FaStar, label: 'Top', value: 'top' },
    { icon: FaClock, label: 'Rising', value: 'rising' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="p-2">
        <div className="grid grid-cols-4 gap-2">
          {sortOptions.map(({ icon, label, value }) => (
            <SortButton
              key={value}
              icon={icon}
              label={label}
              isActive={activeSort === value}
              onClick={() => setActiveSort(value)}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}

export default SortBar; 