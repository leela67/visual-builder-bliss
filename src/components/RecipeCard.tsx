import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Eye, Clock } from "lucide-react";
import StarRating from "./StarRating";
import FavoriteHeartButton from "./ui/FavoriteHeartButton";
import EnhancedImage from "./EnhancedImage";
import { logImageAnalysis } from "@/utils/imageDebugger";

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
  categories?: string[];
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
  categories,
  cook_time,
  views,
  is_popular
}: RecipeCardProps) => {
  // Use new API format if available, fallback to old format
  const recipeId = recipe_id?.toString() || id || '';
  const recipeName = name || title || '';

  // Determine the image URL, filtering out empty strings
  const recipeImage = (image_url && image_url.trim() !== '') ? image_url :
                      (image && image.trim() !== '') ? image :
                      '';

  // Debug: Analyze the image URL only if it exists
  if (recipeImage) {
    logImageAnalysis(recipeImage, `RecipeCard #${recipeId} - ${recipeName}`);
  } else {
    console.warn(`⚠️ RecipeCard #${recipeId} - ${recipeName}: No image URL provided, will use fallback`);
  }

  const viewCount = views || 0;

  // Determine which categories to display
  const displayCategories = categories && categories.length > 0
    ? categories
    : category
    ? [category]
    : [];

  return (
    <Link to={`/recipes/${recipeId}`}>
      <Card className="overflow-hidden hover:shadow-card-hover transition-shadow duration-200 bg-card">
        <div className="relative">
          <EnhancedImage
            src={recipeImage}
            alt={recipeName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            fallbackSrc="https://placehold.co/400x300/e2e8f0/64748b?text=Recipe"
            aspectRatio="video"
            showLoadingSpinner={false}
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
            {displayCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {displayCategories.slice(0, 2).map((cat, index) => (
                  <span key={index} className="inline-block px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full">
                    {cat}
                  </span>
                ))}
                {displayCategories.length > 2 && (
                  <span className="inline-block px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full">
                    +{displayCategories.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;