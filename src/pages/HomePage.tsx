import { Search, ChefHat, Instagram, Twitter, Facebook, Plus } from "lucide-react";
import InfoIconButton from "../components/ui/InfoIconButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import RecipeCard from "@/components/RecipeCard";
import RandomRecipeModal from "@/components/RandomRecipeModal";
import { useState, useEffect, useRef } from "react";
import { RecipeService, type RecipeListItem, type RandomRecipeResponse } from "@/api/recipeService";
import { toast } from "sonner";
import beingHomeLogo from "/beinghomelogo.jpeg";

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState<RecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Random recipe modal state
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState<RandomRecipeResponse | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        // Try to get popular recipes first, fallback to regular recipes
        let response;
        try {
          response = await RecipeService.getPopularRecipes(1, 6);
        } catch (error) {
          console.warn('Popular recipes not available, fetching regular recipes');
          response = await RecipeService.getRecipes(1, 6);
        }

        if (response.success && response.data) {
          setFeaturedRecipes(response.data);
        } else {
          setFeaturedRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching featured recipes:', error);
        // Fallback to empty array
        setFeaturedRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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

  const handleWhatToCook = async () => {
    setIsRandomModalOpen(true);
    await fetchRandomRecipe();
  };

  const fetchRandomRecipe = async () => {
    setIsLoadingRandom(true);
    try {
      const response = await RecipeService.getRandomRecipe();
      if (response.success && response.data) {
        setRandomRecipe(response.data);
      } else {
        toast.error(response.message || "Failed to get random recipe");
        setRandomRecipe(null);
      }
    } catch (error) {
      console.error('Error fetching random recipe:', error);
      toast.error("Failed to get random recipe. Please try again.");
      setRandomRecipe(null);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handleStartCooking = (recipeId: number) => {
    setIsRandomModalOpen(false);
    navigate(`/recipes/${recipeId}`);
  };

  const handleTryAnother = async () => {
    setRandomRecipe(null);
    await fetchRandomRecipe();
  };

  const handleCloseModal = () => {
    setIsRandomModalOpen(false);
    setRandomRecipe(null);
  };

  // Placeholder social media posts
  const socialPosts = [
    {
      id: 1,
      platform: "instagram",
      user: "@recipemasters",
      content: "Check out this amazing pasta dish! 🍝 Simple ingredients, incredible flavor. What's your favorite comfort food?",
      likes: 124,
      time: "2h ago",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      platform: "twitter",
      user: "@healthyeats",
      content: "Starting your morning right with this nutritious breakfast bowl! 🥣 Packed with oats, fresh fruits, and energy for the day ahead.",
      likes: 89,
      time: "4h ago",
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      platform: "facebook",
      user: "Cooking Community",
      content: "Weekend cooking tip: Prep your ingredients in advance for stress-free weekday meals! What's your favorite meal prep hack?",
      likes: 67,
      time: "1d ago",
      image: null
    }
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case "twitter":
        return <Twitter className="w-4 h-4 text-blue-500" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-background pb-24 lg:pb-20"
      style={{
        position: "relative",
        WebkitOverflowScrolling: "touch"
      }}
    >

      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-6">
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
          
          <div className="relative mb-4">
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
              className="pl-10 bg-background border-input"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <section className="mb-8">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Popular Recipes</h2>
            <Link to="/recipes">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                See all
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card rounded-lg overflow-hidden shadow-card">
                    <div className="aspect-[4/3] bg-accent/20"></div>
                    <div className="p-4">
                      <div className="h-4 bg-accent/20 rounded mb-2"></div>
                      <div className="h-3 bg-accent/20 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredRecipes.length > 0 ? (
              featuredRecipes.map((recipe) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No recipes found. <Link to="/create-recipe" className="text-primary hover:underline">Create your first recipe!</Link>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Social Media</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View all
            </Button>
          </div>
          
          <div className="space-y-4">
            {socialPosts.map((post) => (
              <Card key={post.id} className="p-4 bg-card shadow-card">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getSocialIcon(post.platform)}
                    <span className="font-medium text-sm text-card-foreground">{post.user}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-card-foreground text-sm mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                      <button className="flex items-center gap-1 hover:text-primary transition touch-manipulation active:scale-95">
                        <span>❤️</span>
                        <span>{post.likes} likes</span>
                      </button>
                      <button className="hover:text-primary transition touch-manipulation active:scale-95">
                        Comment
                      </button>
                      <button className="hover:text-primary transition touch-manipulation active:scale-95">
                        Share
                      </button>
                    </div>
                  </div>
                  
                  {post.image && (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.image}
                        alt="Social media post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              Connect with us on social media for more recipes and cooking tips!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Instagram className="w-4 h-4" />
                Follow
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Twitter className="w-4 h-4" />
                Follow
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Facebook className="w-4 h-4" />
                Like
              </Button>
            </div>
          </div>
        </section>
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
          onClick={handleWhatToCook}
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

      {/* Random Recipe Modal */}
      <RandomRecipeModal
        isOpen={isRandomModalOpen}
        onClose={handleCloseModal}
        recipe={randomRecipe}
        isLoading={isLoadingRandom}
        onStartCooking={handleStartCooking}
        onTryAnother={handleTryAnother}
      />

      {/* Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
};

export default HomePage;