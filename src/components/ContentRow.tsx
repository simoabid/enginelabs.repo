import React, { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Movie, TVShow } from '../types';
import ContentCard from './ContentCard';

interface ContentRowProps {
  title: string;
  items: (Movie | TVShow)[];
  onItemPlay: (item: Movie | TVShow) => void;
  onItemMoreInfo: (item: Movie | TVShow) => void;
  onAddToList?: (item: Movie | TVShow) => void;
  loading?: boolean;
  error?: string | null;
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  onItemPlay,
  onItemMoreInfo,
  onAddToList,
  loading,
  error
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-4 px-4">{title}</h2>
        <div className="flex space-x-4 px-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-48 h-72 bg-gray-700 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-4 px-4">{title}</h2>
        <div className="px-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">Error loading content: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-4 px-4">{title}</h2>
        <div className="px-4">
          <p className="text-gray-400">No content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 relative group">
      <h2 className="text-white text-xl font-bold mb-4 px-4">{title}</h2>
      
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <FiChevronRight size={24} />
          </button>
        )}

        {/* Content Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onPlay={() => onItemPlay(item)}
              onMoreInfo={() => onItemMoreInfo(item)}
              onAddToList={onAddToList ? () => onAddToList(item) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentRow;