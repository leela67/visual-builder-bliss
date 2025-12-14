import { useState, useEffect } from 'react';
import { Star, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import ratingsService, { type Rating } from '@/api/ratingsService';
import { AuthService } from '@/api/auth';

interface RatingInputProps {
  recipeId: number;
  onRatingSubmitted?: (rating: Rating) => void;
  onRatingDeleted?: () => void;
}

const RatingInput = ({ recipeId, onRatingSubmitted, onRatingDeleted }: RatingInputProps) => {
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      loadUserRating();
    } else {
      setIsLoading(false);
    }
  }, [recipeId, isAuthenticated]);

  const loadUserRating = async () => {
    try {
      setIsLoading(true);
      const response = await ratingsService.getUserRating(recipeId);
      if (response.success && response.data) {
        setUserRating(response.data);
        setRating(response.data.rating);
        setReview(response.data.review || '');
      }
    } catch (error) {
      // User hasn't rated this recipe yet - this is expected
      setUserRating(null);
      setRating(0);
      setReview('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await ratingsService.manageUserRating(recipeId, rating, review);
      
      setUserRating(result.data);
      toast.success(
        result.action === 'created' 
          ? 'Rating submitted successfully!' 
          : 'Rating updated successfully!'
      );
      
      onRatingSubmitted?.(result.data);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userRating) return;

    try {
      setIsDeleting(true);
      await ratingsService.deleteRating(recipeId);
      
      setUserRating(null);
      setRating(0);
      setReview('');
      toast.success('Rating deleted successfully!');
      
      onRatingDeleted?.();
    } catch (error) {
      console.error('Failed to delete rating:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete rating');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredStar || rating);
      
      return (
        <button
          key={starValue}
          type="button"
          className={`p-1 transition-colors ${
            isFilled 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => setRating(starValue)}
          disabled={isSubmitting}
        >
          <Star 
            className={`w-6 h-6 ${isFilled ? 'fill-current' : ''}`}
          />
        </button>
      );
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6 bg-card">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Rate This Recipe</h3>
          <p className="text-muted-foreground mb-4">
            Please log in to rate and review this recipe.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/login'}>
            Log In to Rate
          </Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 bg-card">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading your rating...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">
        {userRating ? 'Update Your Rating' : 'Rate This Recipe'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Your Rating
          </label>
          <div className="flex items-center space-x-1">
            {renderStars()}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground">
                {rating} out of 5 stars
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Review (Optional)
          </label>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            maxLength={1000}
            rows={4}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {review.length}/1000 characters
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            type="submit" 
            disabled={rating === 0 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {userRating ? 'Update Rating' : 'Submit Rating'}
          </Button>
          
          {userRating && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {userRating && (
          <div className="text-xs text-muted-foreground">
            {userRating.status === 'pending' && (
              <p className="text-yellow-600">⏳ Your rating is pending approval</p>
            )}
            {userRating.status === 'approved' && (
              <p className="text-green-600">✅ Your rating has been approved</p>
            )}
            {userRating.status === 'rejected' && (
              <p className="text-red-600">❌ Your rating was not approved</p>
            )}
          </div>
        )}
      </form>
    </Card>
  );
};

export default RatingInput;