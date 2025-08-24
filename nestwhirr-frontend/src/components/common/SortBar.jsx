import { FaHotjar, FaRocket, FaCertificate, FaChartLine } from 'react-icons/fa';

function SortBar({ currentSort, onSortChange }) {
  const sortOptions = [
    { id: 'hot', label: 'Hot', icon: FaHotjar },
    { id: 'new', label: 'New', icon: FaCertificate },
    { id: 'top', label: 'Top', icon: FaChartLine },
    { id: 'rising', label: 'Rising', icon: FaRocket },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 mb-4">
      <div className="flex space-x-2">
        {sortOptions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSortChange(id)}
            className={`flex items-center px-4 py-2 rounded-full text-sm ${
              currentSort === id
                ? 'bg-gray-200 dark:bg-gray-700 text-cyan-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            <Icon className="mr-2" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SortBar; 