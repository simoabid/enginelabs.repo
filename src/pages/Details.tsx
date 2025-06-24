import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlay, FiPlus, FiThumbsUp, FiArrowLeft, FiStar, FiCalendar, FiClock } from 'react-icons/fi';
import { MovieDetails, TVShowDetails } from '../types';
import { tmdbService, getBackdropURL, getImageURL } from '../services/tmdbService';
import { formatRuntime, formatReleaseDate, getTrailerFromVideos } from '../utils';
import { useAPI } from '../hooks/useAPI';
import Image from '../components/Image';
import VideoPlayer from '../components/VideoPlayer';

const Details: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<{ key: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'videos'>('overview');

  const isMovie = type === 'movie';
  const itemId = parseInt(id || '0');

  // Fetch details
  const { data: movieDetails, loading: movieLoading, error: movieError } = useAPI(() => 
    isMovie ? tmdbService.getMovieDetails(itemId) : Promise.resolve(null as MovieDetails | null),
    [itemId, isMovie]
  );

  const { data: tvDetails, loading: tvLoading, error: tvError } = useAPI(() => 
    !isMovie ? tmdbService.getTVShowDetails(itemId) : Promise.resolve(null as TVShowDetails | null),
    [itemId, isMovie]
  );

  const details = isMovie ? movieDetails : tvDetails;
  const detailsLoading = isMovie ? movieLoading : tvLoading;
  const detailsError = isMovie ? movieError : tvError;

  // Fetch credits
  const { data: credits, loading: creditsLoading } = useAPI(() => 
    isMovie ? tmdbService.getMovieCredits(itemId) : tmdbService.getTVShowCredits(itemId),
    [itemId, isMovie]
  );

  // Fetch videos
  const { data: videos, loading: videosLoading } = useAPI(() => 
    isMovie ? tmdbService.getMovieVideos(itemId) : tmdbService.getTVShowVideos(itemId),
    [itemId, isMovie]
  );

  const handlePlayTrailer = () => {
    if (videos?.results) {
      const trailer = getTrailerFromVideos(videos.results);
      if (trailer) {
        const title = isMovie && details && 'title' in details
          ? details.title 
          : details && 'name' in details
          ? details.name
          : 'Unknown Title';
        
        setSelectedVideo({
          key: trailer.key,
          title: title || 'Trailer'
        });
      } else {
        alert('No trailer available for this content.');
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading details...</p>
        </div>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Content not found</h1>
          <button
            onClick={handleBack}
            className="netflix-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropURL(details?.backdrop_path || null, 'original');
  const posterUrl = getImageURL(details?.poster_path || null, 'w500');
  const title = isMovie && details && 'title' in details
    ? details.title 
    : details && 'name' in details
    ? details.name
    : 'Unknown Title';
  const releaseDate = isMovie && details && 'release_date' in details
    ? details.release_date 
    : details && 'first_air_date' in details
    ? details.first_air_date
    : '';

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Hero Section */}
      <div className="relative h-screen">
        <Image
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-20 left-8 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
        >
          <FiArrowLeft size={24} />
        </button>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 max-w-screen-xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Poster */}
              <div className="flex-shrink-0">
                <Image
                  src={posterUrl}
                  alt={title}
                  className="w-80 h-auto rounded-lg shadow-2xl"
                />
              </div>

              {/* Details */}
              <div className="flex-1 max-w-2xl">
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  {title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <FiStar className="text-yellow-500" size={20} />
                    <span className="text-lg font-semibold">
                      {details?.vote_average?.toFixed(1) || '0.0'}/10
                    </span>
                    <span className="text-sm">
                      ({details?.vote_count?.toLocaleString() || '0'} votes)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FiCalendar size={18} />
                    <span>{formatReleaseDate(releaseDate)}</span>
                  </div>

                  {isMovie && details && 'runtime' in details && details.runtime && (
                    <div className="flex items-center space-x-2">
                      <FiClock size={18} />
                      <span>{formatRuntime(details.runtime)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {details?.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  )) || []}
                </div>

                {/* Overview */}
                <p className="text-white text-lg leading-relaxed mb-8">
                  {details?.overview || 'No overview available.'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handlePlayTrailer}
                    className="netflix-button flex items-center justify-center space-x-2 text-lg px-8 py-3"
                  >
                    <FiPlay size={24} />
                    <span>Play Trailer</span>
                  </button>
                  
                  <button className="netflix-button-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3">
                    <FiPlus size={24} />
                    <span>My List</span>
                  </button>
                  
                  <button className="netflix-button-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3">
                    <FiThumbsUp size={24} />
                    <span>Like</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="relative z-10 -mt-32 bg-netflix-black pt-32">
        <div className="px-8 max-w-screen-xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'cast', label: 'Cast & Crew' },
              { key: 'videos', label: 'Videos' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 text-lg font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-netflix-red border-b-2 border-netflix-red'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pb-16">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-white text-2xl font-bold mb-4">Synopsis</h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {details?.overview || 'No synopsis available.'}
                  </p>
                  
                  {details?.tagline && (
                    <div className="mb-6">
                      <h4 className="text-white text-xl font-semibold mb-2">Tagline</h4>
                      <p className="text-gray-300 italic">"{details.tagline}"</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-white text-2xl font-bold mb-4">Details</h3>
                  <div className="space-y-4 text-gray-300">
                    <div>
                      <span className="font-semibold text-white">Release Date:</span>
                      <br />
                      {new Date(releaseDate).toLocaleDateString()}
                    </div>
                    
                    {isMovie && details && 'runtime' in details && details.runtime && (
                      <div>
                        <span className="font-semibold text-white">Runtime:</span>
                        <br />
                        {formatRuntime(details.runtime)}
                      </div>
                    )}
                    
                    <div>
                      <span className="font-semibold text-white">Genres:</span>
                      <br />
                      {details?.genres?.map(g => g.name).join(', ') || 'No genres available'}
                    </div>
                    
                    <div>
                      <span className="font-semibold text-white">Rating:</span>
                      <br />
                      ⭐ {details?.vote_average?.toFixed(1) || '0.0'}/10 ({details?.vote_count?.toLocaleString() || '0'} votes)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div>
                {creditsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading cast...</p>
                  </div>
                ) : credits ? (
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-6">Cast</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {credits.cast.slice(0, 12).map((person) => (
                        <div key={person.id} className="text-center">
                          <Image
                            src={getImageURL(person.profile_path, 'w200')}
                            alt={person.name}
                            className="w-full h-48 object-cover rounded-lg mb-2"
                          />
                          <h4 className="text-white font-semibold text-sm">{person.name}</h4>
                          <p className="text-gray-400 text-xs">{person.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No cast information available.</p>
                )}
              </div>
            )}

            {activeTab === 'videos' && (
              <div>
                {videosLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading videos...</p>
                  </div>
                ) : videos?.results && videos.results.length > 0 ? (
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-6">Videos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videos.results
                        .filter(video => video.site === 'YouTube')
                        .slice(0, 9)
                        .map((video) => (
                          <div
                            key={video.id}
                            className="bg-netflix-gray rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => setSelectedVideo({ key: video.key, title: video.name })}
                          >
                            <div className="relative">
                              <img
                                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                                alt={video.name}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-200">
                                <FiPlay size={48} className="text-white" />
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="text-white font-semibold">{video.name}</h4>
                              <p className="text-gray-400 text-sm">{video.type}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No videos available.</p>
                )}
              </div>
            )}
          </div>
        </div>
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

export default Details;