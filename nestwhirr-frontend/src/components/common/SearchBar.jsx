import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaReddit } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { mockSubnestService as subnestService } from '../../services/mockServices';
import useDebounce from '../../hooks/useDebounce';

function SearchBar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults } = useQuery({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () => subnestService.searchSubnests(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search Nestwhirr"
          className="w-full h-[36px] pl-10 pr-4 bg-gray-100 dark:bg-gray-700 rounded-full text-sm border border-transparent hover:border-blue-500 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-blue-500"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      </form>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm && searchResults?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-2">
            {searchResults.map((subnest) => (
              <button
                key={subnest.name}
                onClick={() => {
                  navigate(`/n/${subnest.name}`);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                    <FaReddit className="text-white text-sm" />
                  </div>
                  <div>
                    <div className="font-medium">n/{subnest.name}</div>
                    <div className="text-xs text-gray-500">
                      {subnest.memberCount.toLocaleString()} members
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar; 