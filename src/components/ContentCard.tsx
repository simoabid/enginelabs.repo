import React, { useState } from 'react';
import { FiPlay, FiPlus, FiThumbsUp, FiChevronDown } from 'react-icons/fi';
import { Movie, TVShow } from '../types';
import { getImageURL } from '../services/tmdbService';
import { getTitle, formatReleaseDate, getReleaseDate, formatVoteAverage } from '../utils';
import Image from './Image';

interface ContentCardProps {
  item: Movie | TVShow;
  onPlay: () => void;
  onAddToList?: () => void;
  onMoreInfo: () => void;
  size?: 'small' | 'medium' | 'large';
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  onPlay, 
  onAddToList, 
  onMoreInfo, 
  size = 'medium' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = getTitle(item);
  const releaseYear = formatReleaseDate(getReleaseDate(item));
  const rating = formatVoteAverage(item.vote_average);
  const posterUrl = getImageURL(item.poster_path, size === 'large' ? 'w500' : 'w300');

  const sizeClasses = {
    small: 'w-40 h-60',
    medium: 'w-48 h-72',
    large: 'w-56 h-84'
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} flex-shrink-0 cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="content-card h-full relative overflow-hidden">
        <Image
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Expanded Card on Hover */}
      {isHovered && imageLoaded && (
        <div className="absolute top-0 left-0 w-80 bg-netflix-gray rounded-lg shadow-2xl z-50 transform -translate-y-2 scale-110 transition-all duration-200">
          {/* Image */}
          <div className="relative">
            <Image
              src={posterUrl}
              alt={title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-t-lg">
              <button
                onClick={onPlay}
                className="bg-white hover:bg-gray-200 text-black p-3 rounded-full transition-colors duration-200"
              >
                <FiPlay size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={onPlay}
                  className="bg-white hover:bg-gray-200 text-black p-2 rounded-full transition-colors duration-200"
                  title="Play"
                >
                  <FiPlay size={16} />
                </button>
                
                {onAddToList && (
                  <button
                    onClick={onAddToList}
                    className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full border border-gray-600 transition-colors duration-200"
                    title="Add to My List"
                  >
                    <FiPlus size={16} />
                  </button>
                )}
                
                <button
                  className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full border border-gray-600 transition-colors duration-200"
                  title="Like"
                >
                  <FiThumbsUp size={16} />
                </button>
              </div>
              
              <button
                onClick={onMoreInfo}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full border border-gray-600 transition-colors duration-200"
                title="More Info"
              >
                <FiChevronDown size={16} />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {title}
            </h3>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span className="text-green-500 font-semibold">{rating} Match</span>
              <span>{releaseYear}</span>
            </div>

            {/* Genres or Overview */}
            <p className="text-gray-400 text-sm line-clamp-3">
              {item.overview}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;