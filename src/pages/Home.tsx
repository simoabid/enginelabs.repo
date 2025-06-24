import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie, TVShow } from '../types';
import { tmdbService } from '../services/tmdbService';
import { getTrailerFromVideos } from '../utils';
import { useAPI } from '../hooks/useAPI';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import VideoPlayer from '../components/VideoPlayer';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [heroItem, setHeroItem] = useState<Movie | TVShow | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ key: string; title: string } | null>(null);

  // Fetch trending movies for hero section
  const { data: trendingMovies, loading: trendingLoading } = useAPI(() => 
    tmdbService.getTrendingMovies()
  );

  // Fetch various content rows
  const { data: popularMovies, loading: popularMoviesLoading, error: popularMoviesError } = useAPI(() => 
    tmdbService.getPopularMovies()
  );

  const { data: topRatedMovies, loading: topRatedLoading, error: topRatedError } = useAPI(() => 
    tmdbService.getTopRatedMovies()
  );

  const { data: upcomingMovies, loading: upcomingLoading, error: upcomingError } = useAPI(() => 
    tmdbService.getUpcomingMovies()
  );

  const { data: popularTVShows, loading: popularTVLoading, error: popularTVError } = useAPI(() => 
    tmdbService.getPopularTVShows()
  );

  const { data: topRatedTVShows, loading: topRatedTVLoading, error: topRatedTVError } = useAPI(() => 
    tmdbService.getTopRatedTVShows()
  );

  // Set hero item when trending movies are loaded
  useEffect(() => {
    if (trendingMovies?.results && trendingMovies.results.length > 0) {
      // Pick a random movie from the first 5 trending movies
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingMovies.results.length));
      setHeroItem(trendingMovies.results[randomIndex]);
    }
  }, [trendingMovies]);

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

  const handleHeroPlayTrailer = () => {
    if (heroItem) {
      handlePlayTrailer(heroItem);
    }
  };

  const handleHeroMoreInfo = () => {
    if (heroItem) {
      handleMoreInfo(heroItem);
    }
  };

  const handleAddToList = (item: Movie | TVShow) => {
    // TODO: Implement add to list functionality
    console.log('Add to list:', item);
    alert('Added to your list! (Feature coming soon)');
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      {heroItem && !trendingLoading && (
        <Hero
          item={heroItem}
          onPlayTrailer={handleHeroPlayTrailer}
          onMoreInfo={handleHeroMoreInfo}
        />
      )}

      {trendingLoading && (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading...</p>
          </div>
        </div>
      )}

      {/* Content Rows */}
      <div className="relative z-10 -mt-32 pb-8">
        {/* Trending Movies */}
        {trendingMovies && (
          <ContentRow
            title="Trending Now"
            items={trendingMovies.results}
            onItemPlay={handlePlayTrailer}
            onItemMoreInfo={handleMoreInfo}
            onAddToList={handleAddToList}
          />
        )}

        {/* Popular Movies */}
        <ContentRow
          title="Popular Movies"
          items={popularMovies?.results || []}
          onItemPlay={handlePlayTrailer}
          onItemMoreInfo={handleMoreInfo}
          onAddToList={handleAddToList}
          loading={popularMoviesLoading}
          error={popularMoviesError}
        />

        {/* Top Rated Movies */}
        <ContentRow
          title="Top Rated Movies"
          items={topRatedMovies?.results || []}
          onItemPlay={handlePlayTrailer}
          onItemMoreInfo={handleMoreInfo}
          onAddToList={handleAddToList}
          loading={topRatedLoading}
          error={topRatedError}
        />

        {/* Upcoming Movies */}
        <ContentRow
          title="Coming Soon"
          items={upcomingMovies?.results || []}
          onItemPlay={handlePlayTrailer}
          onItemMoreInfo={handleMoreInfo}
          onAddToList={handleAddToList}
          loading={upcomingLoading}
          error={upcomingError}
        />

        {/* Popular TV Shows */}
        <ContentRow
          title="Popular TV Shows"
          items={popularTVShows?.results || []}
          onItemPlay={handlePlayTrailer}
          onItemMoreInfo={handleMoreInfo}
          onAddToList={handleAddToList}
          loading={popularTVLoading}
          error={popularTVError}
        />

        {/* Top Rated TV Shows */}
        <ContentRow
          title="Top Rated TV Shows"
          items={topRatedTVShows?.results || []}
          onItemPlay={handlePlayTrailer}
          onItemMoreInfo={handleMoreInfo}
          onAddToList={handleAddToList}
          loading={topRatedTVLoading}
          error={topRatedTVError}
        />
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

export default Home;