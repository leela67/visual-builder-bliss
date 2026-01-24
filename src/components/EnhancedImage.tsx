import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  // Normalize the image URL synchronously using useMemo to avoid race conditions
  const normalizedSrc = useMemo(() => {
    console.log('🖼️ EnhancedImage: Processing image', {
      original_src: src?.substring(0, 100),
      src_length: src?.length,
      fallback: fallbackSrc
    });
    
    const normalized = normalizeImageUrl(src, fallbackSrc);
    
    console.log('🖼️ EnhancedImage: Normalized result', {
      normalized_src: normalized?.substring(0, 100),
      normalized_length: normalized?.length,
      is_fallback: normalized === fallbackSrc
    });
    
    if (!normalized || normalized.trim() === '') {
      console.error('❌ EnhancedImage: normalizeImageUrl returned empty string, using fallback');
      return fallbackSrc;
    }
    
    return normalized;
  }, [src, fallbackSrc]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(normalizedSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  // Update currentSrc when normalizedSrc changes
  useEffect(() => {
    setCurrentSrc(normalizedSrc);
    setIsLoading(true);
    setHasError(false);
  }, [normalizedSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.error('❌ Enhanced image failed to load', {
      attempted_src: currentSrc?.substring(0, 100),
      attempted_src_length: currentSrc?.length,
      normalized_src: normalizedSrc?.substring(0, 100),
      normalized_src_length: normalizedSrc?.length,
      original_src: src?.substring(0, 100),
      original_src_length: src?.length,
      alt,
      is_fallback: currentSrc === fallbackSrc
    });
    
    setIsLoading(false);
    
    // Only set fallback if we haven't already tried it
    if (!hasError && !currentSrc.includes('placehold.co')) {
      console.warn('⚠️ Attempting fallback image...');
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else if (hasError) {
      console.error('❌ Fallback image also failed to load');
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