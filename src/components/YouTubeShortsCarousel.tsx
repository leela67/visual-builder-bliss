import { useState, useRef, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
  thumbnail: string;
  channelTitle: string;
}

const YouTubeShortsCarousel = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch cooking videos from YouTube API
  const fetchCookingVideos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // YouTube API key should be in environment variables
      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_API_KEY';
      
      // Search queries for cooking content
      const searchQueries = [
        'cooking recipe shorts',
        'quick cooking tutorial',
        'easy recipe video',
        'cooking tips shorts',
        'food recipe tutorial'
      ];
      
      const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(randomQuery)}&` +
        `type=video&` +
        `videoDuration=short&` +
        `maxResults=20&` +
        `key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch videos from YouTube');
      }

      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const fetchedVideos: YouTubeVideo[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          videoId: item.id.videoId,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle
        }));
        
        setVideos(fetchedVideos);
      } else {
        // Fallback to curated list if API fails
        setVideos(getFallbackVideos());
      }
    } catch (err) {
      console.error('Error fetching YouTube videos:', err);
      setError('Unable to load videos. Using curated content.');
      // Use fallback videos
      setVideos(getFallbackVideos());
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback curated cooking videos
  const getFallbackVideos = (): YouTubeVideo[] => [
    {
      id: '1',
      title: 'Quick Pasta Recipe - 5 Minutes',
      videoId: 'qsTAkCLHZkk',
      thumbnail: 'https://img.youtube.com/vi/qsTAkCLHZkk/maxresdefault.jpg',
      channelTitle: 'Cooking Channel'
    },
    {
      id: '2',
      title: 'Perfect Scrambled Eggs',
      videoId: 'PUP7U5vTMM0',
      thumbnail: 'https://img.youtube.com/vi/PUP7U5vTMM0/maxresdefault.jpg',
      channelTitle: 'Chef Tips'
    },
    {
      id: '3',
      title: 'Easy Breakfast Ideas',
      videoId: 'VhQhZyNKqhM',
      thumbnail: 'https://img.youtube.com/vi/VhQhZyNKqhM/maxresdefault.jpg',
      channelTitle: 'Morning Recipes'
    },
    {
      id: '4',
      title: 'Healthy Smoothie Bowl',
      videoId: 'ixk01QlUPqw',
      thumbnail: 'https://img.youtube.com/vi/ixk01QlUPqw/maxresdefault.jpg',
      channelTitle: 'Healthy Eats'
    },
    {
      id: '5',
      title: 'Homemade Pizza Tutorial',
      videoId: 'sv3TXMSv6Lw',
      thumbnail: 'https://img.youtube.com/vi/sv3TXMSv6Lw/maxresdefault.jpg',
      channelTitle: 'Pizza Master'
    },
    {
      id: '6',
      title: 'Chocolate Cake Recipe',
      videoId: 'mcZdTvOqmvI',
      thumbnail: 'https://img.youtube.com/vi/mcZdTvOqmvI/maxresdefault.jpg',
      channelTitle: 'Dessert Delights'
    },
    {
      id: '7',
      title: 'Stir Fry Vegetables',
      videoId: 'Tm6LHrxJsYo',
      thumbnail: 'https://img.youtube.com/vi/Tm6LHrxJsYo/maxresdefault.jpg',
      channelTitle: 'Veggie Recipes'
    },
    {
      id: '8',
      title: 'Grilled Chicken Tips',
      videoId: 'jQD6S6v4TyU',
      thumbnail: 'https://img.youtube.com/vi/jQD6S6v4TyU/maxresdefault.jpg',
      channelTitle: 'Grill Master'
    }
  ];

  useEffect(() => {
    fetchCookingVideos();
  }, []);

  // Handle vertical scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const videoHeight = container.clientHeight;
    
    // Calculate which video is currently in view
    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
  };

  // Scroll to specific video
  const scrollToVideo = (index: number) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setCurrentIndex(index);
    }
  };

  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading cooking videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Recipe Shorts</h2>
          <p className="text-sm text-muted-foreground">
            Swipe up/down to browse • {currentIndex + 1} of {videos.length}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCookingVideos}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Vertical Scrolling Container - YouTube Shorts Style */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative w-full h-[calc(100vh-280px)] md:h-[600px] overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => (videoRefs.current[index] = el)}
            className="w-full h-full snap-start snap-always flex items-center justify-center bg-black/5"
          >
            <Card className="w-full max-w-md h-full overflow-hidden bg-card shadow-lg">
              {/* Video Container - Full height */}
              <div className="relative w-full h-full bg-black">
                <iframe
                  src={getEmbedUrl(video.videoId)}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                />
                
                {/* Video Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {video.channelTitle}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center gap-1 mt-4">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToVideo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-1.5 bg-muted-foreground/30'
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground mt-4 text-center">
        💡 Scroll vertically to browse cooking videos • Tap video to play/pause
      </p>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default YouTubeShortsCarousel;