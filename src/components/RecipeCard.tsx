import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Eye, Clock } from "lucide-react";
import StarRating from "./StarRating";
import FavoriteHeartButton from "./ui/FavoriteHeartButton";

interface RecipeCardProps {
  // Support both old and new API formats
  id?: string;
  recipe_id?: number;
  title?: string;
  name?: string;
  image?: string;
  image_url?: string;
  rating: number;
  category?: string;
  cook_time?: number;
  views?: number;
  is_popular?: boolean;
}

const RecipeCard = ({
  id,
  recipe_id,
  title,
  name,
  image,
  image_url,
  rating,
  category,
  cook_time,
  views,
  is_popular
}: RecipeCardProps) => {
  // Use new API format if available, fallback to old format
  const recipeId = recipe_id?.toString() || id || '';
  const recipeName = name || title || '';
  // image_url now contains base64-encoded data URIs (e.g., "data:image/jpeg;base64,...")
  const recipeImage = image_url || image || '/api/placeholder/400/300';
  const viewCount = views || 0;

  return (
    <Link to={`/recipes/${recipeId}`}>
      <Card className="overflow-hidden hover:shadow-card-hover transition-shadow duration-200 bg-card">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={recipeImage}
            alt={recipeName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/400/300";
            }}
          />
          <FavoriteHeartButton recipeId={recipeId} />
          {is_popular && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Popular
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{recipeName}</h3>
          <div className="flex items-center justify-between mb-2">
            <StarRating rating={rating} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {viewCount}
            </div>
          </div>
          <div className="flex items-center justify-between">
            {cook_time && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {cook_time} min
              </div>
            )}
            {category && (
              <span className="inline-block px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full">
                {category}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;