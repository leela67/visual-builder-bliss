import { useState, useEffect, useRef } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import { Search, ArrowLeft, ChefHat, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import { Link, useSearchParams } from "react-router-dom";
import { RecipeService, type RecipeListItem } from "@/api/recipeService";
import { RECIPE_CATEGORIES, type RecipeCategory } from "@/api/config";
import { toast } from "sonner";
import beingHomeLogo from "/beinghomelogo.jpeg";

const RecipesPage = () => {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDietaryType, setSelectedDietaryType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ["All", ...RECIPE_CATEGORIES];
  const dietaryTypes = ["All", "Veg", "Non-Veg", "Egg", "Vegan"];
  
  // Fetch recipes based on current filters
  useEffect(() => {
    fetchRecipes();
  }, [selectedCategory, selectedDietaryType, searchQuery]);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);

      // Always use search API with proper parameters
      const response = await RecipeService.searchRecipes({
        search: searchQuery.trim() || undefined,
        meal_type: selectedCategory !== "All" ? selectedCategory as RecipeCategory : undefined,
        dietary_type: selectedDietaryType !== "All" ? selectedDietaryType : undefined,
        page: 1,
        limit: 20
      });

      if (response.success && response.data) {
        setRecipes(response.data);
      } else {
        toast.error("Failed to load recipes");
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error("Failed to load recipes");
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes();
  };

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
      className="min-h-screen bg-background pb-24 lg:pb-20"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="pl-10 pr-4 bg-background border-input"
              />
            </div>
            
            {/* Dietary Preference Dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Select value={selectedDietaryType} onValueChange={setSelectedDietaryType}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Diet" />
                </SelectTrigger>
                <SelectContent>
                  {dietaryTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-xs">
                      <div className="flex items-center gap-2">
                        {type === "Veg" && (
                          <div className="w-3 h-3 border border-green-600 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          </div>
                        )}
                        {type === "Non-Veg" && (
                          <div className="w-3 h-3 border border-red-600 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                          </div>
                        )}
                        {type === "Vegan" && (
                          <div className="w-3 h-3 border border-green-700 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
                          </div>
                        )}
                        {type === "Egg" && (
                          <div className="w-3 h-3 border border-yellow-600 bg-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                          </div>
                        )}
                        <span>{type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Categories</h3>
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

        </div>
      </header>

      <main className="px-4 py-6">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading recipes...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipe_id={recipe.recipe_id}
                  name={recipe.name}
                  image_url={recipe.image_url}
                  rating={recipe.rating}
                  cook_time={recipe.cook_time}
                  views={recipe.views}
                  is_popular={recipe.is_popular}
                />
              ))}
            </div>

            {recipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery ? `No recipes found for "${searchQuery}"` : "No recipes found for this category."}
                </p>
              </div>
            )}
          </>
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

      {/* Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};

export default RecipesPage;