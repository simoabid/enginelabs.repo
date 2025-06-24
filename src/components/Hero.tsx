import React, { useState, useEffect } from 'react';
import { FiPlay, FiInfo, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { Movie, TVShow } from '../types';
import { getBackdropURL } from '../services/tmdbService';
import { getTitle, truncateText, formatReleaseDate, getReleaseDate } from '../utils';
import Image from './Image';

interface HeroProps {
  item: Movie | TVShow;
  onPlayTrailer: () => void;
  onMoreInfo: () => void;
}

const Hero: React.FC<HeroProps> = ({ item, onPlayTrailer, onMoreInfo }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const backdropUrl = getBackdropURL(item.backdrop_path, 'original');
  const title = getTitle(item);
  const releaseYear = formatReleaseDate(getReleaseDate(item));

  useEffect(() => {
    // Show controls after a short delay
    const timer = setTimeout(() => setShowControls(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto w-full">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 transition-all duration-1000 ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {title}
            </h1>

            {/* Release Year and Rating */}
            <div 
              className={`flex items-center space-x-4 mb-4 transition-all duration-1000 delay-200 ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="text-white text-lg font-semibold">{releaseYear}</span>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                  ★ {item.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-300 text-sm">
                  ({item.vote_count.toLocaleString()} votes)
                </span>
              </div>
            </div>

            {/* Overview */}
            <p 
              className={`text-white text-lg sm:text-xl leading-relaxed mb-8 transition-all duration-1000 delay-400 ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {truncateText(item.overview, 200)}
            </p>

            {/* Action Buttons */}
            <div 
              className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-all duration-1000 delay-600 ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={onPlayTrailer}
                className="netflix-button flex items-center justify-center space-x-2 text-lg px-8 py-3 min-w-[200px] group"
              >
                <FiPlay size={24} className="group-hover:scale-110 transition-transform" />
                <span>Play Trailer</span>
              </button>
              
              <button
                onClick={onMoreInfo}
                className="netflix-button-secondary flex items-center justify-center space-x-2 text-lg px-8 py-3 min-w-[200px] group"
              >
                <FiInfo size={24} className="group-hover:scale-110 transition-transform" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="absolute bottom-24 right-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full border-2 border-gray-600 hover:border-white transition-all duration-200"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Auto-play Video Background (Optional Enhancement) */}
      {/* This would require video trailer URLs and additional implementation */}
    </div>
  );
};

export default Hero;