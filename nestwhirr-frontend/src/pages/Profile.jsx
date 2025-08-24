import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// import { postService } from '../services/post.service';
import { mockPostService as postService } from '../services/mockServices';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';
import { FaUserEdit, FaBirthdayCake, FaAward, FaRegCalendarAlt, FaRegCommentAlt, FaRegNewspaper } from 'react-icons/fa';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
        <Icon className="text-cyan-500 text-xl" />
      </div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-bold">{value}</div>
      </div>
    </div>
  );
}

function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.username === username;

  const {
    data: userPosts,
    error,
    status,
  } = useQuery({
    queryKey: ['userPosts', username],
    queryFn: () => postService.getUserPosts(username),
  });

  if (status === 'pending') return <LoadingSpinner />;

  if (status === 'error') {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const stats = [
    {
      icon: FaAward,
      label: 'Karma',
      value: userPosts.user.karma || 0,
    },
    {
      icon: FaBirthdayCake,
      label: 'Cake Day',
      value: new Date(userPosts.user.createdAt).toLocaleDateString(),
    },
    {
      icon: FaRegNewspaper,
      label: 'Posts',
      value: userPosts.posts.length,
    },
    {
      icon: FaRegCommentAlt,
      label: 'Comments',
      value: userPosts.user.commentCount || 0,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-t-lg" />
        
        {/* Profile Info */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm px-6 pb-6">
          <div className="relative flex items-end space-x-4">
            {/* Avatar */}
            <div className="absolute -top-8">
              <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-full p-1">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                    {username[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="ml-36 pt-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">u/{username}</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {userPosts.user.bio || 'No bio provided'}
                  </p>
                </div>
                {isOwnProfile && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors">
                    <FaUserEdit />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Tabs & Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b dark:border-gray-700 px-4">
          <div className="flex space-x-8">
            <button className="px-4 py-4 text-cyan-500 border-b-2 border-cyan-500 font-medium">
              Posts
            </button>
            <button className="px-4 py-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              Comments
            </button>
            <button className="px-4 py-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              About
            </button>
          </div>
        </div>

        <div className="divide-y dark:divide-gray-700">
          {userPosts.posts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <FaRegNewspaper className="mx-auto text-4xl mb-4" />
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm">
                  {isOwnProfile
                    ? "When you create posts, they'll show up here"
                    : `u/${username} hasn't made any posts yet`}
                </p>
              </div>
            </div>
          ) : (
            userPosts.posts.map((post) => (
              <div key={post.id} className="p-4">
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 