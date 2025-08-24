import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useThemeStore from '../../store/themeStore';
import useAuthStore from '../../store/authStore';
import { FaSun, FaMoon, FaReddit, FaQrcode, FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SearchBar from '../common/SearchBar';
import UserMenu from '../user/UserMenu';
import AuthDialog from '../auth/AuthDialog';
import nestwhirrLogo from '../../assets/nestwhirr.png';

function MenuButton({ isOpen, toggle }) {
  return (
    <motion.button
      onClick={toggle}
      className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-6">
        {/* Menu Lines */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 10 : 0,
            backgroundColor: isOpen ? "rgb(6, 182, 212)" : ""
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute top-[10px] left-0 right-0 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 20 : 0
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -10 : 0,
            backgroundColor: isOpen ? "rgb(6, 182, 212)" : ""
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.button>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogView, setAuthDialogView] = useState('login');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAuthClick = (view) => {
    setAuthDialogView(view);
    setShowAuthDialog(true);
  };

  // Update mobile menu state and dispatch event
  const toggleMobileMenu = () => {
    const newState = !showMobileMenu;
    setShowMobileMenu(newState);
    window.dispatchEvent(new CustomEvent('toggleMobileMenu', { 
      detail: { isOpen: newState } 
    }));
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMobileMenu && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
        toggleMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 h-12 z-50">
        <div className="h-full max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-full">
            {/* Menu Button */}
            <div className="menu-button">
              <MenuButton 
                isOpen={showMobileMenu} 
                toggle={toggleMobileMenu}
              />
            </div>

            {/* Left section - Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src={nestwhirrLogo} alt="Nestwhirr" className="w-8 h-8" />
                <span className="text-[1rem] font-semibold hidden lg:block">Nestwhirr</span>
              </Link>
            </div>

            {/* Middle-right section - Search */}
            <div className="flex-1 flex justify-end max-w-3xl ml-4 lg:ml-8">
              <div className="w-full max-w-[600px]">
                <SearchBar />
              </div>
            </div>

            {/* Right section - Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Link
                to="/download"
                className="hidden md:flex items-center space-x-2 py-1 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <FaQrcode className="text-lg" />
                <span>Get App</span>
              </Link>
              
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="py-1 px-4 text-sm font-semibold rounded-full border border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-gray-700"
                  >
                    Log In
                  </button>
                  
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="py-1 px-4 text-sm font-semibold rounded-full bg-cyan-500 text-white hover:bg-cyan-600"
                  >
                    Sign Up
                  </button>
                </>
              )}

              <button
                onClick={toggleTheme}
                className="p-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <FaMoon className="text-gray-600 dark:text-gray-400 text-lg" />
                ) : (
                  <FaSun className="text-gray-600 dark:text-gray-400 text-lg" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        initialView={authDialogView}
      />
    </>
  );
}

export default Navbar; 