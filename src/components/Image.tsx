import React, { useState, useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, fallbackSrc, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    } else {
      // Create a data URL for a simple placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw a dark gray background
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw a centered icon-like rectangle
        ctx.fillStyle = '#6B7280';
        const iconWidth = 60;
        const iconHeight = 60;
        const iconX = (canvas.width - iconWidth) / 2;
        const iconY = (canvas.height - iconHeight) / 2;
        ctx.fillRect(iconX, iconY, iconWidth, iconHeight);
        
        // Draw a simple "No Image" text
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No Image', canvas.width / 2, canvas.height / 2 + iconHeight / 2 + 25);
        
        setImageSrc(canvas.toDataURL());
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <img
        {...props}
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default Image;