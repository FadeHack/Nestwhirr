import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import { authService } from '../../services/auth.service';

function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // First call Firebase logout
      await authService.logout();
      // Then clear local state
      logout();
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error with Firebase, still clear local state
      logout();
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <FaUser className="text-gray-500 dark:text-gray-400" />
        </div>
        <span className="text-sm font-medium">{user.username}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <Link
            to={`/user/${user.username}`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaUser className="mr-3" />
            Profile
          </Link>

          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaCog className="mr-3" />
            Settings
          </Link>

          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'light' ? (
              <>
                <FaMoon className="mr-3" />
                Dark Mode
              </>
            ) : (
              <>
                <FaSun className="mr-3" />
                Light Mode
              </>
            )}
          </button>

          <hr className="my-1 border-gray-200 dark:border-gray-700" />

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaSignOutAlt className="mr-3" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu; 