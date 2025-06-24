import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { Movie, TVShow } from '../types';
import { tmdbService } from '../services/tmdbService';
import { getTrailerFromVideos, debounce } from '../utils';
import ContentCard from '../components/ContentCard';
import VideoPlayer from '../components/VideoPlayer';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ key: string; title: string } | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await tmdbService.searchMulti(searchQuery);
        // Filter out person results, keep only movies and TV shows
        const filteredResults = response.results.filter(item => 
          'title' in item || 'name' in item
        );
        
        setResults(filteredResults);
        setTotalResults(response.total_results);
      } catch (err) {
        setError('Failed to search. Please try again.');
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  }, [searchParams, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handlePlayTrailer = async (item: Movie | TVShow) => {
    try {
      const isMovie = 'title' in item;
      const videos = isMovie 
        ? await tmdbService.getMovieVideos(item.id)
        : await tmdbService.getTVShowVideos(item.id);

      const trailer = getTrailerFromVideos(videos.results);
      
      if (trailer) {
        setSelectedVideo({
          key: trailer.key,
          title: isMovie ? item.title : item.name
        });
      } else {
        alert('No trailer available for this content.');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Failed to load trailer. Please try again later.');
    }
  };

  const handleMoreInfo = (item: Movie | TVShow) => {
    const isMovie = 'title' in item;
    const path = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;
    navigate(path);
  };

  const handleAddToList = (item: Movie | TVShow) => {
    // TODO: Implement add to list functionality
    console.log('Add to list:', item);
    alert('Added to your list! (Feature coming soon)');
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-20">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for movies and TV shows..."
              value={query}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-4 bg-netflix-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        {query && (
          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold">
              {loading ? 'Searching...' : `Search results for "${query}"`}
            </h2>
            {!loading && totalResults > 0 && (
              <p className="text-gray-400 mt-2">
                Found {totalResults.toLocaleString()} results
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Searching...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && totalResults === 0 && (
          <div className="text-center py-16">
            <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-400">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-16">
            {results.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onPlay={() => handlePlayTrailer(item)}
                onMoreInfo={() => handleMoreInfo(item)}
                onAddToList={() => handleAddToList(item)}
                size="medium"
              />
            ))}
          </div>
        )}

        {/* Empty State (no search query) */}
        {!query && (
          <div className="text-center py-16">
            <FiSearch size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              Search for movies and TV shows
            </h3>
            <p className="text-gray-400">
              Discover thousands of movies and TV shows available for streaming.
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          videoKey={selectedVideo.key}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Search;