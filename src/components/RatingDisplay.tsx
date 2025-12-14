import { useState, useEffect } from 'react';
import { Star, User, Loader2, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ratingsService, { type RatingWithDetails, type RatingStats } from '@/api/ratingsService';

interface RatingDisplayProps {
  recipeId: number;
  refreshTrigger?: number; // Used to trigger refresh when user submits/updates rating
}

const RatingDisplay = ({ recipeId, refreshTrigger }: RatingDisplayProps) => {
  const [ratings, setRatings] = useState<RatingWithDetails[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const RATINGS_PER_PAGE = 5;

  useEffect(() => {
    loadRatings();
  }, [recipeId, currentPage, refreshTrigger]);

  const loadRatings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [ratingsResponse, statsData] = await Promise.all([
        ratingsService.getRecipeRatings(recipeId, currentPage, RATINGS_PER_PAGE),
        ratingsService.getRecipeStats(recipeId)
      ]);

      if (ratingsResponse.success && ratingsResponse.data) {
        setRatings(ratingsResponse.data.ratings);
        setTotalPages(Math.ceil(ratingsResponse.data.total / RATINGS_PER_PAGE));
      }

      setStats(statsData);
    } catch (err) {
      console.error('Failed to load ratings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load ratings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      const isHalfFilled = starValue - 0.5 <= rating && starValue > rating;
      
      return (
        <Star
          key={starValue}
          className={`${sizeClasses[size]} ${
            isFilled 
              ? 'text-yellow-400 fill-current' 
              : isHalfFilled
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300'
          }`}
        />
      );
    });
  };

  const renderRatingDistribution = () => {
    if (!stats || stats.totalRatings === 0) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(starCount => {
          const count = stats.ratingDistribution[starCount] || 0;
          const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
          
          return (
            <div key={starCount} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-muted-foreground">{starCount}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-muted-foreground text-xs">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-card">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading ratings...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-card">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load ratings: {error}</p>
          <Button variant="outline" onClick={loadRatings}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats || stats.totalRatings === 0) {
    return (
      <Card className="p-6 bg-card">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">No Ratings Yet</h3>
          <p className="text-muted-foreground">
            Be the first to rate and review this recipe!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Recipe Ratings</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-3xl font-bold text-card-foreground">
                {stats.averageRating.toFixed(1)}
              </span>
              <div className="flex items-center">
                {renderStars(stats.averageRating, 'lg')}
              </div>
            </div>
            <p className="text-muted-foreground">
              Based on {stats.totalRatings} review{stats.totalRatings !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">Rating Distribution</h4>
            {renderRatingDistribution()}
          </div>
        </div>
      </Card>

      {/* Individual Reviews */}
      {ratings.length > 0 && (
        <Card className="p-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Recent Reviews
            </h3>
            {totalPages > 1 && (
              <Badge variant="secondary">
                Page {currentPage} of {totalPages}
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-card-foreground">
                        {rating.user_name}
                      </span>
                      <div className="flex items-center">
                        {renderStars(rating.rating, 'sm')}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {rating.rating}/5
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(rating.created_at)}
                    </p>
                    
                    {rating.review && (
                      <p className="text-card-foreground text-sm leading-relaxed">
                        {rating.review}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground px-4">
                {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default RatingDisplay;