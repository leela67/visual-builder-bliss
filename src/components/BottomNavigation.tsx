import { Home, BookOpen, ChefHat, User, Plus, Utensils, Video } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RecipeService, type RandomRecipeResponse } from "@/api/recipeService";
import { toast } from "sonner";
import RandomRecipeModal from "@/components/RandomRecipeModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState<RandomRecipeResponse | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

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

  // Mobile navigation items (with K-Bank button, YouTube Shorts instead of Favorites, What to Cook instead of Profile)
  const mobileNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Recipes", path: "/recipes" },
    { icon: Utensils, label: "K-Bank", path: "/k-bank", isSpecial: true },
    { icon: Video, label: "YouTube Shorts", path: "/profile?tab=shorts", isShorts: true },
    { icon: ChefHat, label: "What to Cook", path: "#", isWhatToCook: true },
  ];

  // Desktop navigation items (with K-Bank instead of Create, YouTube Shorts instead of Favorites, What to Cook instead of Profile)
  const desktopNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Recipes", path: "/recipes" },
    { icon: Utensils, label: "K-Bank", path: "/k-bank" },
    { icon: Video, label: "YouTube Shorts", path: "/profile?tab=shorts", isShorts: true },
    { icon: ChefHat, label: "What to Cook", path: "#", isWhatToCook: true },
  ];

  return (
    <>
      {/* Mobile Navigation - Floating */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Floating container with gap from bottom */}
        <div className="px-4 pb-6">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl">
            <div className="flex items-center justify-around h-16 px-2">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                // Handle What to Cook button
                if (item.isWhatToCook) {
                  return (
                    <button
                      key={item.label}
                      onClick={handleWhatToCook}
                      className={`relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 touch-manipulation min-w-[56px] text-muted-foreground hover:text-foreground`}
                    >
                      <div className="relative z-10 transition-all duration-300">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <span className="relative z-10 text-[10px] font-medium transition-all duration-300">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                // YouTube Shorts button - handled as regular link below

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 touch-manipulation min-w-[56px] ${
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {/* Active indicator - elevated background */}
                    {active && (
                      <div className="absolute inset-0 bg-primary/10 rounded-xl -top-3 shadow-lg border-2 border-primary/20" />
                    )}

                    {/* Icon container with special styling for K-Bank button */}
                    <div className={`relative z-10 transition-all duration-300 ${
                      item.isSpecial && active
                        ? "bg-primary text-primary-foreground rounded-full p-2 -mt-2 shadow-lg scale-110"
                        : item.isSpecial
                        ? "bg-primary/90 text-primary-foreground rounded-full p-2 -mt-2 shadow-md"
                        : active
                        ? "scale-110"
                        : ""
                    }`}>
                      <Icon size={item.isSpecial ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
                    </div>

                    {/* Label */}
                    <span className={`relative z-10 text-[10px] font-medium transition-all duration-300 ${
                      active ? "font-semibold" : ""
                    } ${item.isSpecial ? "mt-1" : ""}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Navigation - Traditional */}
      <nav className="hidden lg:block fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            // Handle What to Cook button
            if (item.isWhatToCook) {
              return (
                <button
                  key={item.label}
                  onClick={handleWhatToCook}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            }

            // YouTube Shorts button - handled as regular link below
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] ${
                  active
                    ? "text-primary-foreground bg-primary shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Random Recipe Modal */}
      <RandomRecipeModal
        isOpen={isRandomModalOpen}
        onClose={handleCloseModal}
        recipe={randomRecipe}
        isLoading={isLoadingRandom}
        onStartCooking={handleStartCooking}
        onTryAnother={handleTryAnother}
      />
    </>
  );
};

export default BottomNavigation;