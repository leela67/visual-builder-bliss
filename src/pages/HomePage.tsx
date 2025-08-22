import { Search, ChefHat, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import pastaImage from "@/assets/pasta-vegetables.jpg";
import breakfastImage from "@/assets/breakfast-bowl.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  
  const featuredRecipes = [
    {
      id: "1",
      title: "Pasta with Vegetables",
      image: pastaImage,
      rating: 5,
      category: "Dinner"
    },
    {
      id: "2", 
      title: "Healthy Breakfast Bowl",
      image: breakfastImage,
      rating: 4,
      category: "Breakfast"
    }
  ];

  const handleWhatToCook = () => {
    // Get a random recipe from available recipes
    const randomRecipe = featuredRecipes[Math.floor(Math.random() * featuredRecipes.length)];
    navigate(`/recipes/${randomRecipe.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Recipes</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search recipes..." 
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <section className="mb-8">
          <Button 
            onClick={handleWhatToCook}
            className="w-full mb-6 bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium gap-2"
          >
            <CheckCircle className="w-6 h-6" />
            WTC Button
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Popular Recipes</h2>
            <Link to="/recipes">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                See all
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-accent to-accent/50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-accent-foreground mb-2">
              Create Your Own Recipe
            </h3>
            <p className="text-accent-foreground/80 mb-4 text-sm">
              Share your culinary creations with the community
            </p>
            <Link to="/create-recipe">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;