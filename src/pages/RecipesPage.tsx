import { useState, useEffect, useRef } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import { Search, Filter, ArrowLeft, ChefHat, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import { Link } from "react-router-dom";
import beingHomeLogo from "/beinghomelogo.jpeg";

const RecipesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = Math.abs(currentScrollY - lastScrollY);
          
          // Only process significant scroll changes to avoid Safari momentum issues
          if (scrollDiff > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
              // Scrolling down - expand buttons
              setIsExpanded(true);
              
              // Clear existing timeout when actively scrolling down
              if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
              }
              
              // Set timeout to contract after 4 seconds for Safari compatibility
              scrollTimeoutRef.current = setTimeout(() => {
                setIsExpanded(false);
              }, 4000);
            } else if (currentScrollY < lastScrollY && scrollDiff > 10) {
              // Scrolling up with significant movement - contract buttons
              setIsExpanded(false);
              
              // Clear timeout when scrolling up
              if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
              }
            }
            
            setLastScrollY(currentScrollY);
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // Add touchstart and touchmove for iOS Safari
    const handleTouchStart = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };

    const handleTouchEnd = () => {
      // Delay to allow momentum scrolling to complete
      setTimeout(() => {
        if (window.scrollY > 50) {
          setIsExpanded(true);
          scrollTimeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
          }, 4000);
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  return (
    <div 
      className="min-h-screen bg-background pb-20" 
      style={{ 
        position: "relative",
        WebkitOverflowScrolling: "touch"
      }}
    >

      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          {/* Logo and Info Button Row */}
          <div className="flex items-center justify-between mb-6">
            {/* Being Home Logo - Extreme Left */}
            <img 
              src={beingHomeLogo}
              alt="Being Home Logo" 
              className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 object-cover rounded-full"
              style={{ 
                transform: 'scale(1.5, 1.5)',
                transformOrigin: 'left center'
              }}
              onError={(e) => {
                console.error('Logo failed to load from:', beingHomeLogo);
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Info Button - Extreme Right */}
            <InfoIconButton />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search recipes..." 
                className="pl-10 pr-4 bg-background border-input"
              />
            </div>
            
            {/* Veg/Non-Veg iOS Toggle */}
            <label className="form-switch flex items-center cursor-pointer flex-shrink-0 touch-manipulation">
              <span className="mr-2 text-xs sm:text-sm font-medium text-foreground">
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

      {/* Floating Buttons */}
      <div className="fixed bottom-20 right-2 sm:right-4 z-40 flex flex-col gap-3">
        {/* Create Recipe Button */}
        <Link to="/create-recipe">
          <Button 
            size="sm" 
            className={`py-3 bg-yellow-200 text-yellow-800 hover:bg-yellow-300 active:bg-yellow-400 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out rounded-full touch-manipulation ${
              isExpanded 
                ? 'gap-2 px-4 min-w-[140px] sm:min-w-[160px] justify-start' 
                : 'w-14 h-14 p-0 min-w-0 justify-center items-center'
            }`}
          >
            <Plus className={`w-5 h-5 flex-shrink-0 ${isExpanded ? '' : 'absolute'}`} />
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isExpanded ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
            }`}>
              Create Recipe
            </span>
          </Button>
        </Link>
        
        {/* What to Cook Button */}
        <Button
          className={`py-3 bg-primary text-primary-foreground font-semibold shadow-xl border-0 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out rounded-full touch-manipulation ${
            isExpanded 
              ? 'gap-2 px-4 min-w-[140px] sm:min-w-[160px] justify-start' 
              : 'w-14 h-14 p-0 min-w-0 justify-center items-center'
          }`}
        >
          <ChefHat className={`w-5 h-5 flex-shrink-0 ${isExpanded ? '' : 'absolute'}`} />
          <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
            isExpanded ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0'
          }`}>
            What to Cook
          </span>
        </Button>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default RecipesPage;