import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const favoriteRecipes = [
    {
      id: "1",
      title: "Pasta with Vegetables",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
      rating: 5,
      category: "Dinner"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20" style={{ position: "relative" }}>
      {/* Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <BottomNavigation />
      </div>
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
        </div>
      </header>

      <main className="px-4 py-6">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding recipes to your favorites to see them here
            </p>
            <Link to="/recipes">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Browse Recipes
              </Button>
            </Link>
          </div>
        )}
      </main>

    </div>
  );
};

export default FavoritesPage;