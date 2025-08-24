import { Link } from 'react-router-dom';
import { FaReddit, FaChevronUp } from 'react-icons/fa';
import nestwhirrLogo from '../../assets/nestwhirr.png';


function CommunityItem({ rank, name, members, isSubscribed }) {
  return (
    <div className="flex items-center space-x-3 py-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 w-4">
        {rank}
      </span>
      <FaChevronUp className="text-green-500" />
      <div className="flex items-center flex-1 min-w-0">
        <img 
          src={nestwhirrLogo} 
          alt="Nestwhirr" 
          className="w-6 h-6 mr-2 flex-shrink-0" 
        />
        <Link 
          to={`/n/${name}`}
          className="font-medium truncate hover:underline"
        >
          n/{name}
        </Link>
      </div>
      <button 
        className={`px-4 py-1 text-xs font-bold rounded-full ${
          isSubscribed
            ? 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-blue-500 hover:text-blue-600'
        }`}
      >
        {isSubscribed ? 'Joined' : 'Join'}
      </button>
    </div>
  );
}

function TopCommunities() {
  const communities = [
    { name: 'AskReddit', members: 42000000, isSubscribed: true },
    { name: 'funny', members: 38000000, isSubscribed: false },
    { name: 'gaming', members: 34200000, isSubscribed: true },
    { name: 'aww', members: 30500000, isSubscribed: false },
    { name: 'pics', members: 29800000, isSubscribed: false },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-bold">Top Growing Communities</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          {communities.map((community, index) => (
            <CommunityItem 
              key={community.name}
              rank={index + 1}
              {...community}
            />
          ))}
        </div>

        <Link
          to="/subnests/leaderboard"
          className="block text-center text-blue-500 hover:text-blue-600 font-bold mt-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
        <p>
          Top communities ranking is based on the number of new subscribers in the past 24 hours.
        </p>
      </div>
    </div>
  );
}

export default TopCommunities; 