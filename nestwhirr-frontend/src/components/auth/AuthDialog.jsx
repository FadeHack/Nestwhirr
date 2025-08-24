import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import useAuthStore from '../../store/authStore';
import { FaReddit, FaGoogle, FaGithub, FaApple, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../../config/firebase';

function SocialButton({ icon: Icon, onClick, bgColor = 'bg-white', textColor = 'text-gray-700 dark:text-gray-200', label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 ${bgColor} hover:shadow-lg hover:border-opacity-50 transition-all duration-200 ${textColor}`}
      title={`Continue with ${label}`}
    >
      <Icon className="text-xl" />
    </motion.button>
  );
}

function InputField({ type, icon: Icon, placeholder, value, onChange, name, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  
  return (
    <div className="space-y-1">
      <div className="relative">
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          isFocused ? 'text-cyan-500' : 'text-gray-400'
        }`}>
          <Icon />
        </div>
        <input
          type={showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 pl-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function AuthDialog({ isOpen, onClose, initialView = 'login' }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [view, setView] = useState(initialView);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    }
  }, [isOpen, initialView]);

  // Email/Password Login Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      onClose();
    },
    onError: (error) => {
      let errorMessage = 'Login failed';
      
      // Firebase error handling
      if (error.code) {
        switch(error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Invalid password';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Try again later';
            break;
          default:
            errorMessage = 'Login failed: ' + error.message;
        }
      }
      
      setErrors({ general: errorMessage });
    },
  });

  // Email/Password Registration Mutation
  const registerMutation = useMutation({
    mutationFn: ({ username, email, password }) =>
      authService.register(username, email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      onClose();
    },
    onError: (error) => {
      let errorMessage = 'Registration failed';
      
      // Firebase error handling
      if (error.code) {
        switch(error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already in use';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address';
            break;
          default:
            errorMessage = 'Registration failed: ' + error.message;
        }
      }
      
      setErrors({ general: errorMessage });
    },
  });

  // Google Sign In Mutation
  const googleSignInMutation = useMutation({
    mutationFn: () => authService.googleSignIn(),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      onClose();
    },
    onError: (error) => {
      setErrors({ general: 'Google sign-in failed: ' + error.message });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (view === 'register') {
      const newErrors = validateForm();
      if (Object.keys(newErrors).length === 0) {
        const { confirmPassword, ...registrationData } = formData;
        registerMutation.mutate(registrationData);
      } else {
        setErrors(newErrors);
      }
    } else {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (view === 'register') {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleSocialAuth = (provider) => {
    if (provider === 'google') {
      googleSignInMutation.mutate();
    } else {
      console.log(`Auth with ${provider} - Not implemented yet`);
    }
  };

  const toggleView = () => {
    setView(view === 'login' ? 'register' : 'login');
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left shadow-xl transition-all"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="text-xl" />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-500/20 rounded-full">
                    <FaReddit className="text-cyan-500 text-4xl" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                    {view === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {view === 'login' 
                      ? 'Log in to your account to continue'
                      : 'Join our community today'}
                  </p>
                </motion.div>
              </div>

              {/* Social Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center items-center space-x-4 mb-8"
              >
                <SocialButton
                  icon={FaGoogle}
                  label="Google"
                  onClick={() => handleSocialAuth('google')}
                  bgColor="bg-white dark:bg-gray-700"
                  textColor="text-gray-700 dark:text-gray-200"
                />
                <SocialButton
                  icon={FaGithub}
                  label="GitHub"
                  onClick={() => handleSocialAuth('github')}
                  bgColor="bg-[#24292e] dark:bg-gray-800"
                  textColor="text-white"
                />
                <SocialButton
                  icon={FaApple}
                  label="Apple"
                  onClick={() => handleSocialAuth('apple')}
                  bgColor="bg-black"
                  textColor="text-white"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
                </div>
              </motion.div>

              {/* Form */}
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                {view === 'register' && (
                  <InputField
                    type="text"
                    icon={FaUser}
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                  />
                )}

                <InputField
                  type="email"
                  icon={FaEnvelope}
                  placeholder="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <InputField
                  type="password"
                  icon={FaLock}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                {view === 'register' && (
                  <InputField
                    type="password"
                    icon={FaLock}
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  {loginMutation.isPending || registerMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">
                        {view === 'login' ? 'Logging in...' : 'Creating account...'}
                      </span>
                    </div>
                  ) : (
                    view === 'login' ? 'Log In' : 'Create Account'
                  )}
                </motion.button>

                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm text-center"
                  >
                    {errors.general}
                  </motion.div>
                )}
              </motion.form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={toggleView}
                    className="text-cyan-500 hover:text-cyan-600 font-medium hover:underline focus:outline-none"
                  >
                    {view === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AuthDialog; 