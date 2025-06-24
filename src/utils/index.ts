import { Movie, TVShow, Video } from '../types';

export const formatReleaseDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const formatVoteAverage = (voteAverage: number): string => {
  return (voteAverage * 10).toFixed(0) + '%';
};

export const isMovie = (item: Movie | TVShow): item is Movie => {
  return 'title' in item && 'release_date' in item;
};

export const isTVShow = (item: Movie | TVShow): item is TVShow => {
  return 'name' in item && 'first_air_date' in item;
};

export const getTitle = (item: Movie | TVShow): string => {
  return isMovie(item) ? item.title : item.name;
};

export const getReleaseDate = (item: Movie | TVShow): string => {
  return isMovie(item) ? item.release_date : item.first_air_date;
};

export const getTrailerFromVideos = (videos: Video[]): Video | null => {
  // Priority order: Official Trailer, Trailer, Teaser, Clip
  const trailerTypes = ['Trailer', 'Teaser', 'Clip'];
  
  for (const type of trailerTypes) {
    const video = videos.find(v => 
      v.site === 'YouTube' && 
      v.type === type && 
      v.official
    );
    if (video) return video;
  }
  
  // Fallback to any YouTube trailer
  return videos.find(v => 
    v.site === 'YouTube' && 
    trailerTypes.includes(v.type)
  ) || null;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const createImageLoadPromise = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });
};