import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaCompass,
  FaGamepad,
  FaChartBar,
  FaReddit,
  FaVideo,
  FaQuestionCircle,
  FaPlus,
  FaCoins,
  FaShieldAlt,
  FaUserShield,
  FaTrophy,
  FaFire,
  FaChartLine,
  FaUsers,
  FaCompass as FaExplore,
  FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import CreateCommunityDialog from '../community/CreateCommunityDialog';
import AuthDialogPortal from '../auth/AuthDialogPortal';

function SidebarSection({ title, children }) {
  return (
    <div className="mb-4">
      {title && (
        <h3 className="px-6 mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function SidebarLink({ icon: Icon, label, to, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-6 py-2 text-sm transition-colors ${
        isActive
          ? 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 font-medium'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className={`mr-3 text-[18px] ${
        isActive ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'
      }`} />
      <span>{label}</span>
    </Link>
  );
}

function LeftSidebar() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogView, setAuthDialogView] = useState('register');

  // Handle mobile menu toggle event
  useEffect(() => {
    const handleMobileMenu = (event) => {
      setIsMobileMenuOpen(event.detail.isOpen);
    };

    window.addEventListener('toggleMobileMenu', handleMobileMenu);
    return () => {
      window.removeEventListener('toggleMobileMenu', handleMobileMenu);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Dispatch event to update navbar icon state
    window.dispatchEvent(new CustomEvent('toggleMobileMenu', { 
      detail: { isOpen: false } 
    }));
  }, [location.pathname]);

  // Handle backdrop click
  const handleBackdropClick = () => {
    setIsMobileMenuOpen(false);
    // Dispatch event to update navbar icon state
    window.dispatchEvent(new CustomEvent('toggleMobileMenu', { 
      detail: { isOpen: false } 
    }));
  };

  const handleAuthClick = (view) => {
    setAuthDialogView(view);
    setShowAuthDialog(true);
  };

  const feeds = [
    { icon: FaHome, label: 'Home', to: '/' },
    { icon: FaFire, label: 'Popular', to: '/n/popular' },
    { icon: FaChartLine, label: 'All', to: '/n/all' },
  ];

  const explore = [
    { icon: FaGamepad, label: 'Gaming', to: '/t/gaming' },
    { icon: FaChartBar, label: 'Sports', to: '/t/sports' },
    { icon: FaVideo, label: 'Television', to: '/t/television' },
    { icon: FaTrophy, label: 'Trending', to: '/trending' },
  ];

  const create = [
    { icon: FaPlus, label: 'Create Post', to: '/submit' },
    { 
      icon: FaUsers, 
      label: 'Create Community', 
      onClick: () => setShowCreateCommunity(true) 
    },
  ];

  const resources = [
    { icon: FaCoins, label: 'Coins', to: '/coins' },
    { icon: FaShieldAlt, label: 'Premium', to: '/premium' },
    { icon: FaUserShield, label: 'Moderator', to: '/moderator' },
  ];

  const sidebarContent = (
    <nav className="py-4">
      <SidebarSection title="Feeds">
        {feeds.map((link) => (
          <SidebarLink
            key={link.label}
            {...link}
            isActive={location.pathname === link.to}
          />
        ))}
      </SidebarSection>

      {isAuthenticated && (
        <>
          <SidebarSection title="Create">
            {create.map((item) => (
              item.to ? (
                <SidebarLink
                  key={item.label}
                  {...item}
                  isActive={location.pathname === item.to}
                />
              ) : (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center px-6 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="mr-3 text-[18px] text-gray-500 dark:text-gray-400" />
                  <span>{item.label}</span>
                </button>
              )
            ))}
          </SidebarSection>

          <SidebarSection title="Resources">
            {resources.map((link) => (
              <SidebarLink
                key={link.label}
                {...link}
                isActive={location.pathname === link.to}
              />
            ))}
          </SidebarSection>
        </>
      )}

      <SidebarSection title="Explore">
        {explore.map((link) => (
          <SidebarLink
            key={link.label}
            {...link}
            isActive={location.pathname === link.to}
          />
        ))}
      </SidebarSection>

      {!isAuthenticated && (
        <div className="px-6 py-4">
          <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
              Create an account
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Join Nestwhirr to follow your favorite communities and start taking part in conversations.
            </p>
            <button
              onClick={() => handleAuthClick('register')}
              className="block w-full py-2 px-4 bg-cyan-500 text-white text-center rounded-full hover:bg-cyan-600 text-sm font-semibold transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      <div className="px-6 pt-4 border-t dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div className="grid grid-cols-2 gap-2">
            <Link to="/help" className="hover:text-gray-700 dark:hover:text-gray-300">Help</Link>
            <Link to="/about" className="hover:text-gray-700 dark:hover:text-gray-300">About</Link>
            <Link to="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">Blog</Link>
            <Link to="/advertise" className="hover:text-gray-700 dark:hover:text-gray-300">Advertise</Link>
            <Link to="/careers" className="hover:text-gray-700 dark:hover:text-gray-300">Careers</Link>
            <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</Link>
          </div>
          <p className="mt-4 text-[11px]">
            Nestwhirr © {new Date().getFullYear()}. All rights reserved
          </p>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed top-12 left-0 h-[calc(100vh-3rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackdropClick}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-800 z-50 overflow-y-auto mobile-menu"
            >
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h2 className="font-semibold">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBackdropClick}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes />
                </motion.button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CreateCommunityDialog
        isOpen={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
      />

      <AuthDialogPortal
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        initialView={authDialogView}
      />
    </>
  );
}

export default LeftSidebar; 