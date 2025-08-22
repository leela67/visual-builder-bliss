import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
}

const StarRating = ({ rating, maxRating = 5, size = 16, showNumber = false }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={`${
            index < rating
              ? "fill-recipe-yellow text-recipe-yellow"
              : "text-muted-foreground"
          }`}
        />
      ))}
      {showNumber && (
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      )}
    </div>
  );
};

export default StarRating;