# Cinephile - Netflix Trailer Clone

A modern web application that replicates the core Netflix user interface and trailer browsing experience. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Netflix-Inspired UI**: Dark theme with red accents, horizontal carousels, and smooth animations
- **Trailer Playback**: Integrated YouTube video player with full controls
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Content Discovery**: Browse trending, popular, top-rated movies and TV shows
- **Search Functionality**: Real-time search with debounced queries
- **Detailed Pages**: Comprehensive information including cast, crew, and videos
- **Robust Image Handling**: Fallback mechanisms to prevent broken images
- **Error Handling**: Graceful handling of network errors and missing content

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Video Player**: React YouTube
- **Icons**: React Icons (Feather Icons)
- **API**: The Movie Database (TMDB) API

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- TMDB API key (free at https://www.themoviedb.org/settings/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd cinephile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Replace `your_api_key_here` with your actual TMDB API key
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to see the application

### Getting a TMDB API Key

1. Create an account at [The Movie Database](https://www.themoviedb.org/)
2. Go to your account settings
3. Navigate to the API section
4. Request an API key (it's free for non-commercial use)
5. Copy your API key and add it to your `.env` file

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Main hero section
│   ├── ContentCard.tsx  # Individual content cards
│   ├── ContentRow.tsx   # Horizontal content carousels
│   ├── VideoPlayer.tsx  # YouTube video player modal
│   └── Image.tsx        # Image component with fallback
├── pages/               # Page components
│   ├── Home.tsx         # Main homepage
│   ├── Details.tsx      # Content detail pages
│   ├── Search.tsx       # Search results page
│   └── NotFound.tsx     # 404 page
├── hooks/               # Custom React hooks
│   └── useAPI.ts        # API data fetching hook
├── services/            # API services
│   └── tmdbService.ts   # TMDB API integration
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
├── utils/               # Utility functions
│   └── index.ts         # Helper functions
└── assets/              # Static assets
```

## Key Features Implementation

### Robust Image Handling

- **Fallback Images**: Automatic fallback to placeholder when images fail to load
- **Loading States**: Smooth loading animations with skeleton screens
- **Error Handling**: Graceful degradation for missing images
- **Optimization**: Responsive image sizes based on screen resolution

### Video Streaming

- **YouTube Integration**: Seamless trailer playback using react-youtube
- **Custom Controls**: Full-featured video player with play/pause, volume, fullscreen
- **Error Handling**: Graceful handling of unavailable videos
- **Responsive Player**: Adapts to different screen sizes

### Performance Optimizations

- **Lazy Loading**: Content loaded as needed to improve initial load time
- **Debounced Search**: Reduces API calls during user input
- **Responsive Images**: Different image sizes for different screen resolutions
- **Caching**: Browser caching for frequently accessed content

### User Experience

- **Smooth Animations**: CSS transitions and hover effects
- **Keyboard Navigation**: Support for keyboard shortcuts in video player
- **Loading States**: Clear feedback during data fetching
- **Error Messages**: User-friendly error messages

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (not recommended)

## Deployment

The application can be deployed to various platforms:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `build` folder
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **GitHub Pages**: Use the `gh-pages` package

## Environment Variables

- `REACT_APP_TMDB_API_KEY`: Your TMDB API key (required)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes only. Please respect The Movie Database API terms of service.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [Netflix](https://netflix.com) for the design inspiration
- React and TypeScript communities for excellent tooling