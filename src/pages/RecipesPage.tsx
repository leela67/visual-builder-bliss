import { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import LoginIconButton from "../components/ui/LoginIconButton";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import { Link } from "react-router-dom";

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks", "Fresh Pickles", "Juices"];
  
  const recipes = [
    {
      id: "1",
      title: "Pasta with Vegetables",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
      rating: 5,
      category: "Dinner",
      servings: 4,
      ingredients: [
        { name: "pasta", quantity: 200, unit: "g" },
        { name: "zucchini", quantity: 1, unit: "piece" },
        { name: "carrot", quantity: 1, unit: "piece" },
        { name: "tomatoes", quantity: 2, unit: "pieces" },
        { name: "olive oil", quantity: 2, unit: "tbsp" },
        { name: "salt and pepper", quantity: 0, unit: "to taste" },
        { name: "fresh herbs (basil, parsley)", quantity: 0, unit: "to taste" }
      ]
    },
    {
      id: "2", 
      title: "Healthy Breakfast Bowl",
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
      rating: 4,
      category: "Breakfast",
      servings: 2,
      ingredients: [
        { name: "oats", quantity: 100, unit: "g" },
        { name: "banana", quantity: 1, unit: "piece" },
        { name: "berries", quantity: 150, unit: "g" },
        { name: "yogurt", quantity: 200, unit: "ml" },
        { name: "honey", quantity: 2, unit: "tbsp" },
        { name: "nuts", quantity: 30, unit: "g" }
      ]
    }
  ];

  const filteredRecipes = selectedCategory === "All" 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "row", zIndex: 50 }}>
        <InfoIconButton />
        <LoginIconButton />
      </div>
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Recipes</h1>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search recipes..." 
              className="pl-10 bg-background border-input"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className={`cursor-pointer whitespace-nowrap transition-colors ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-secondary/80"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recipes found for this category.</p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default RecipesPage;