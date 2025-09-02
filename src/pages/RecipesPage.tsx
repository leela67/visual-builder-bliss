import { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import { Search, Filter, ArrowLeft, ChefHat, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import { Link } from "react-router-dom";

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks", "Fresh Pickles", "Juices"];
  
  const recipes = [
    {
      id: "1",
      title: "Pasta with Vegetables",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
      rating: 5,
      category: "Dinner",
      servings: 4,
      isVeg: true,
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
      isVeg: true,
      ingredients: [
        { name: "oats", quantity: 100, unit: "g" },
        { name: "banana", quantity: 1, unit: "piece" },
        { name: "berries", quantity: 150, unit: "g" },
        { name: "yogurt", quantity: 200, unit: "ml" },
        { name: "honey", quantity: 2, unit: "tbsp" },
        { name: "nuts", quantity: 30, unit: "g" }
      ]
    },
    {
      id: "3", 
      title: "Chicken Curry",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      rating: 5,
      category: "Dinner",
      servings: 4,
      isVeg: false,
      ingredients: [
        { name: "chicken", quantity: 500, unit: "g" },
        { name: "onions", quantity: 2, unit: "pieces" },
        { name: "tomatoes", quantity: 3, unit: "pieces" },
        { name: "ginger-garlic paste", quantity: 2, unit: "tbsp" },
        { name: "spices", quantity: 0, unit: "to taste" },
        { name: "oil", quantity: 3, unit: "tbsp" }
      ]
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const categoryMatch = selectedCategory === "All" || recipe.category === selectedCategory;
    const vegMatch = !isVegOnly || recipe.isVeg;
    return categoryMatch && vegMatch;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-32" style={{ position: "relative" }}>
      {/* Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <BottomNavigation />
      </div>

      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search recipes..." 
                className="pl-10 pr-4 bg-background border-input"
              />
            </div>
            
            {/* Veg/Non-Veg iOS Toggle */}
            <label className="form-switch flex items-center cursor-pointer flex-shrink-0">
              <span className="mr-2 text-xs font-medium text-foreground">
                {isVegOnly ? 'Veg' : 'All'}
              </span>
              <input
                type="checkbox"
                checked={isVegOnly}
                onChange={(e) => setIsVegOnly(e.target.checked)}
                className="sr-only"
              />
              <div className="relative inline-block w-10 h-6 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out">
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    isVegOnly ? 'translate-x-4 bg-white' : 'translate-x-0'
                  }`}
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${
                    isVegOnly ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 rounded-full transition-colors duration-300 ease-in-out ${
                    isVegOnly ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
              {/* Indian Veg/Non-Veg Symbols */}
              <div className="ml-2 flex items-center">
                {isVegOnly ? (
                  <div className="w-4 h-4 border-2 border-green-600 bg-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 border-2 border-red-600 bg-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </label>
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

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-sm z-50">
        <div className="flex items-center justify-center px-4 py-3 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <InfoIconButton />
            <Link to="/create-recipe">
              <Button 
                size="sm" 
                className="gap-2 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Plus className="w-4 h-4" />
                Create Recipe
              </Button>
            </Link>
            <Button 
              size="sm" 
              className="max-w-40 gap-2 py-3 bg-primary text-primary-foreground font-semibold shadow-lg border-0 hover:scale-105 transition-transform duration-200"
            >
              <ChefHat className="w-4 h-4" />
              What to Cook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;