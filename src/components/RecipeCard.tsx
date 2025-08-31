import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import StarRating from "./StarRating";
import FavoriteHeartButton from "./ui/FavoriteHeartButton";
import { useViewCounter } from "@/hooks/useViewCounter";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  category?: string;
}

const RecipeCard = ({ id, title, image, rating, category }: RecipeCardProps) => {
  const { getViewCount } = useViewCounter();
  
  return (
    <Link to={`/recipes/${id}`}>
      <Card className="overflow-hidden hover:shadow-card-hover transition-shadow duration-200 bg-card">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
          <FavoriteHeartButton />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between mb-2">
            <StarRating rating={rating} />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {getViewCount(id)}
            </div>
          </div>
          {category && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full">
              {category}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;