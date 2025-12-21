import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Eye, ChefHat, Shuffle } from 'lucide-react';
import { RandomRecipeResponse } from '@/api/recipeService';

interface RandomRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: RandomRecipeResponse | null;
  isLoading: boolean;
  onStartCooking: (recipeId: number) => void;
  onTryAnother: () => void;
}

const RandomRecipeModal: React.FC<RandomRecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  isLoading,
  onStartCooking,
  onTryAnother,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-card border border-border rounded-2xl shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            What to Cook Today?
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm">Finding the perfect recipe for you...</p>
          </div>
        ) : recipe ? (
          <div className="space-y-4">
            {/* Recipe Image */}
            {recipe.image_url && (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error('Failed to load recipe image:', recipe.image_url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {recipe.is_popular && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                    Popular
                  </Badge>
                )}
              </div>
            )}

            {/* Recipe Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground text-center">
                {recipe.name}
              </h3>

              {/* Recipe Stats */}
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cook_time} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{recipe.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{recipe.views}</span>
                </div>
              </div>

              {/* Intelligent Suggestion */}
              {recipe.intelligent_suggestion && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm text-foreground text-center italic">
                    "{recipe.intelligent_suggestion}"
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => onStartCooking(recipe.recipe_id)}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <ChefHat className="w-4 h-4" />
                Start Cooking
              </Button>
              <Button
                onClick={onTryAnother}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Try Another
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-muted-foreground text-center">
              <ChefHat className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recipe found. Please try again!</p>
            </div>
            <Button onClick={onTryAnother} variant="outline" className="gap-2">
              <Shuffle className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RandomRecipeModal;