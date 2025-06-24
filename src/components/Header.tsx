import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiBell } from 'react-icons/fi';
import { debounce } from '../utils';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const debouncedSearch = debounce((query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-netflix-red text-2xl font-bold mr-8">
                CINEPHILE
              </span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Movies
              </Link>
              <Link
                to="/tv-shows"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                TV Shows
              </Link>
              <Link
                to="/my-list"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                My List
              </Link>
            </nav>
          </div>

          {/* Search and Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search movies, TV shows..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-black/60 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white w-64"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) {
                        setShowSearch(false);
                      }
                    }}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <FiSearch size={20} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="text-white hover:text-gray-300 transition-colors duration-200">
              <FiBell size={20} />
            </button>

            {/* Profile */}
            <div className="relative">
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200">
                <div className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center">
                  <FiUser size={16} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;