import { useState } from 'react';
import { FaUsers, FaComments, FaReddit } from 'react-icons/fa';
import AuthDialogPortal from '../auth/AuthDialogPortal';

function StatCard({ icon: Icon, count, label }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <Icon className="text-4xl text-cyan-500" />
      </div>
      <div className="text-2xl font-bold mb-2">{count}</div>
      <div className="text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

function HeroSection() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogView, setAuthDialogView] = useState('login');

  const handleAuthClick = (view) => {
    setAuthDialogView(view);
    setShowAuthDialog(true);
  };

  const stats = [
    {
      icon: FaUsers,
      count: '50M+',
      label: 'Daily Active Users',
    },
    {
      icon: FaReddit,
      count: '100K+',
      label: 'Communities',
    },
    {
      icon: FaComments,
      count: '5M+',
      label: 'Daily Comments',
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-gray-800 dark:to-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-6 sm:text-5xl">
              Welcome to Nestwhirr
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join millions of people discovering and sharing what's happening right now
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleAuthClick('register')}
                className="px-8 py-3 bg-white text-cyan-500 font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                Join Nestwhirr
              </button>
              <button
                onClick={() => handleAuthClick('login')}
                className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-700 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>

      <AuthDialogPortal
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        initialView={authDialogView}
      />
    </>
  );
}

export default HeroSection; 