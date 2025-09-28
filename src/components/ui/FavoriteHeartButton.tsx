import React, { useState, useEffect } from "react";
import { FavoritesService } from "@/api/favoritesService";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

interface FavoriteHeartButtonProps {
  recipeId: string;
}

export default function FavoriteHeartButton({ recipeId }: FavoriteHeartButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();

  // Check favorite status on mount
  useEffect(() => {
    if (isAuthenticated && recipeId) {
      checkFavoriteStatus();
    }
  }, [recipeId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const numericRecipeId = parseInt(recipeId);
      if (isNaN(numericRecipeId)) return;

      const response = await FavoritesService.checkFavoriteStatus(numericRecipeId);
      if (response.success && response.data) {
        setFavorited(response.data.is_favorite);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }

    const numericRecipeId = parseInt(recipeId);
    if (isNaN(numericRecipeId)) {
      toast.error("Invalid recipe ID");
      return;
    }

    setIsLoading(true);

    try {
      const response = await FavoritesService.toggleFavorite(numericRecipeId);

      if (response.success) {
        setFavorited(response.isFavorite);
        toast.success(response.isFavorite ? "Added to favorites" : "Removed from favorites");
      } else {
        toast.error(response.message || "Failed to update favorites");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-label="Favorite"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="absolute top-2 right-2 z-10 disabled:opacity-50"
      style={{ background: 'transparent', border: 'none', padding: 0 }}
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 24 24"
        fill={favorited ? "#e63946" : "white"}
        stroke="#2D5033"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
      >
        <path d="M12 21s-6.5-5.2-8.5-8.1C2.1 10.1 3.6 7 6.5 7c1.7 0 3.1 1.1 3.8 2.7C11.4 8.1 12.8 7 14.5 7c2.9 0 4.4 3.1 3 5.9-2 2.9-8.5 8.1-8.5 8.1z" />
      </svg>
    </button>
  );
}
