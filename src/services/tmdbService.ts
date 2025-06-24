import axios from 'axios';
import { Movie, TVShow, MovieDetails, TVShowDetails, TMDBResponse, VideosResponse, Credits, Genre } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'your_api_key_here';

// You'll need to get a free API key from https://www.themoviedb.org/settings/api
// and add it to your .env file as REACT_APP_TMDB_API_KEY=your_key_here

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const tmdbService = {
  // Movies
  getTrendingMovies: (): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/trending/movie/week').then(response => response.data),

  getPopularMovies: (): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/movie/popular').then(response => response.data),

  getTopRatedMovies: (): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/movie/top_rated').then(response => response.data),

  getUpcomingMovies: (): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/movie/upcoming').then(response => response.data),

  getNowPlayingMovies: (): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/movie/now_playing').then(response => response.data),

  getMoviesByGenre: (genreId: number): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/discover/movie', { params: { with_genres: genreId } }).then(response => response.data),

  // TV Shows
  getTrendingTVShows: (): Promise<TMDBResponse<TVShow>> =>
    tmdbApi.get('/trending/tv/week').then(response => response.data),

  getPopularTVShows: (): Promise<TMDBResponse<TVShow>> =>
    tmdbApi.get('/tv/popular').then(response => response.data),

  getTopRatedTVShows: (): Promise<TMDBResponse<TVShow>> =>
    tmdbApi.get('/tv/top_rated').then(response => response.data),

  getOnTheAirTVShows: (): Promise<TMDBResponse<TVShow>> =>
    tmdbApi.get('/tv/on_the_air').then(response => response.data),

  getTVShowsByGenre: (genreId: number): Promise<TMDBResponse<TVShow>> =>
    tmdbApi.get('/discover/tv', { params: { with_genres: genreId } }).then(response => response.data),

  // Details
  getMovieDetails: (movieId: number): Promise<MovieDetails> =>
    tmdbApi.get(`/movie/${movieId}`).then(response => response.data),

  getTVShowDetails: (tvShowId: number): Promise<TVShowDetails> =>
    tmdbApi.get(`/tv/${tvShowId}`).then(response => response.data),

  // Videos/Trailers
  getMovieVideos: (movieId: number): Promise<VideosResponse> =>
    tmdbApi.get(`/movie/${movieId}/videos`).then(response => response.data),

  getTVShowVideos: (tvShowId: number): Promise<VideosResponse> =>
    tmdbApi.get(`/tv/${tvShowId}/videos`).then(response => response.data),

  // Credits
  getMovieCredits: (movieId: number): Promise<Credits> =>
    tmdbApi.get(`/movie/${movieId}/credits`).then(response => response.data),

  getTVShowCredits: (tvShowId: number): Promise<Credits> =>
    tmdbApi.get(`/tv/${tvShowId}/credits`).then(response => response.data),

  // Search
  searchMovies: (query: string, page = 1): Promise<TMDBResponse<Movie>> =>
    tmdbApi.get('/search/movie', { params: { query, page } }).then(response => response.data),

  searchTVShows: (query: string, page = 1): Promise<TMDBResponse<TVShow>> =>
    tmdbApi.get('/search/tv', { params: { query, page } }).then(response => response.data),

  searchMulti: (query: string, page = 1): Promise<TMDBResponse<Movie | TVShow>> =>
    tmdbApi.get('/search/multi', { params: { query, page } }).then(response => response.data),

  // Genres
  getMovieGenres: (): Promise<{ genres: Genre[] }> =>
    tmdbApi.get('/genre/movie/list').then(response => response.data),

  getTVGenres: (): Promise<{ genres: Genre[] }> =>
    tmdbApi.get('/genre/tv/list').then(response => response.data),
};

// Image URL helpers
export const getImageURL = (path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder-image.jpg'; // We'll create this fallback image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropURL = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '/placeholder-backdrop.jpg'; // We'll create this fallback image
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getYouTubeEmbedURL = (videoKey: string): string => {
  return `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0`;
};

export const getYouTubeThumbnailURL = (videoKey: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string => {
  return `https://img.youtube.com/vi/${videoKey}/${quality}.jpg`;
};