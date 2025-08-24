import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AuthDialog from '../auth/AuthDialog';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  useEffect(() => {
    // If user is not authenticated, show the auth dialog
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    }
  }, [isAuthenticated]);
  
  // If the user dismisses the auth dialog without logging in, redirect to home
  const handleClose = () => {
    setShowAuthDialog(false);
    // Use setTimeout to ensure the dialog animation completes before navigation
    setTimeout(() => {
      if (!isAuthenticated) {
        window.location.href = '/';
      }
    }, 300);
  };
  
  return (
    <>
      {isAuthenticated ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            You need to be logged in to access this page.
          </p>
          <button
            onClick={() => setShowAuthDialog(true)}
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            Log In or Sign Up
          </button>
        </div>
      )}
      
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={handleClose}
        initialView="login"
      />
    </>
  );
}

export default ProtectedRoute; 