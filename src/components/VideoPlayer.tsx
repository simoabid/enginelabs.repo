import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoKey: string;
  title: string;
  onClose: () => void;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoKey, 
  title, 
  onClose, 
  autoplay = true 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [player, setPlayer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          onClose();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, onClose]);

  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => resetControlsTimeout();
    const handleMouseLeave = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(false);
    };

    if (playerRef.current) {
      playerRef.current.addEventListener('mousemove', handleMouseMove);
      playerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.removeEventListener('mousemove', handleMouseMove);
        playerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const youtubeOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      mute: isMuted ? 1 : 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
    if (autoplay) {
      event.target.playVideo();
      setIsPlaying(true);
    }
  };

  const onStateChange = (event: any) => {
    const { data } = event;
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    setIsPlaying(data === 1);
  };

  const onError = (event: any) => {
    console.error('YouTube player error:', event);
    setError('Failed to load video. Please try again later.');
  };

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    document.exitFullscreen().then(() => {
      setIsFullscreen(false);
    });
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-netflix-gray rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-xl font-bold">Error</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setError(null)}
              className="netflix-button-secondary"
            >
              Retry
            </button>
            <button
              onClick={onClose}
              className="netflix-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div
        ref={playerRef}
        className={`relative bg-black ${
          isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-full max-h-[80vh]'
        } rounded-lg overflow-hidden`}
      >
        {/* YouTube Player */}
        <div className="w-full h-full">
          <YouTube
            videoId={videoKey}
            opts={youtubeOptions}
            onReady={onReady}
            onStateChange={onStateChange}
            onError={onError}
            className="w-full h-full"
          />
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/70 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
            <h2 className="text-white text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Center Play/Pause */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-4"
            >
              {isPlaying ? <FiPause size={32} /> : <FiPlay size={32} />}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
              </button>
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isFullscreen ? <FiMinimize2 size={24} /> : <FiMaximize2 size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;