import React, { useState, useRef, useEffect } from 'react';
import { normalizeImageUrl } from '@/utils/imageDebugger';

interface EnhancedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
  showLoadingSpinner?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
}

const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = "https://placehold.co/800x400/e2e8f0/64748b?text=Recipe+Image",
  onClick,
  loading = 'lazy',
  showLoadingSpinner = true,
  aspectRatio = 'auto'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Normalize the image URL when src changes
  useEffect(() => {
    const normalizedSrc = normalizeImageUrl(src, fallbackSrc);
    setCurrentSrc(normalizedSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.error('❌ Enhanced image failed to load', {
      attempted_src: currentSrc,
      original_src: src,
      alt
    });
    
    setIsLoading(false);
    
    // Only set fallback if we haven't already tried it
    if (!hasError && !currentSrc.includes('placehold.co')) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${getAspectRatioClass()} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Loading Spinner */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Skeleton Placeholder */}
      {isLoading && !showLoadingSpinner && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        draggable={false}
      />

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          <div className="text-center">
            <div className="mb-2">📷</div>
            <div>Image unavailable</div>
          </div>
        </div>
      )}

      {/* Click Overlay for Interactive Images */}
      {onClick && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
            Click to view
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedImage;