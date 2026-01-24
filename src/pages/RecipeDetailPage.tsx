import { ArrowLeft, Clock, Users, Youtube, Share2, Eye, Plus, Minus, AlertTriangle, Loader2, ChefHat } from "lucide-react";
import InfoIconButton from "../components/ui/InfoIconButton";
import LoginIconButton from "../components/ui/LoginIconButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "@/components/StarRating";
import BottomNavigation from "@/components/BottomNavigation";
import FavoriteHeartButton from "@/components/ui/FavoriteHeartButton";
import RatingInput from "@/components/RatingInput";
import RatingDisplay from "@/components/RatingDisplay";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RecipeService, type Recipe } from "@/api/recipeService";
import { toast } from "sonner";
import { logImageAnalysis, normalizeImageUrl } from "@/utils/imageDebugger";
import EnhancedImage from "@/components/EnhancedImage";
import ImageViewer from "@/components/ImageViewer";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentServings, setCurrentServings] = useState(1);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [ratingRefreshTrigger, setRatingRefreshTrigger] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Helper function to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        navigate('/recipes');
        return;
      }

      try {
        setIsLoading(true);
        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
          toast.error("Invalid recipe ID");
          navigate('/recipes');
          return;
        }
        const response = await RecipeService.getRecipeById(recipeId);

        if (!response.success || !response.data) {
          toast.error("Recipe not found");
          navigate('/recipes');
          return;
        }

        // Debug: Analyze the recipe image
        logImageAnalysis(response.data.image_url, `Recipe #${response.data.recipe_id} - ${response.data.name}`);

        setRecipe(response.data);
        setCurrentServings(response.data.servings);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error("Failed to load recipe");
        navigate('/recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.name || "Recipe",
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const adjustServings = (newServings: number) => {
    if (newServings >= 1 && newServings <= 100) {
      setCurrentServings(newServings);
    }
  };

  const getScaledQuantity = (originalQuantity: number, originalServings: number) => {
    if (originalQuantity === 0) return 0;
    return (originalQuantity * currentServings) / originalServings;
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (quantity === 0) return "";
    if (quantity % 1 === 0) {
      return `${quantity} ${unit}`;
    } else {
      return `${quantity.toFixed(1)} ${unit}`;
    }
  };

  const handleReportSubmit = () => {
    if (issueDescription.trim() && recipe) {
      // In a real app, this would send the report to your backend
      console.log("Report submitted:", {
        recipeId: recipe.recipe_id,
        recipeTitle: recipe.name,
        category: recipe.categories?.[0],
        issueDescription,
        timestamp: new Date().toISOString()
      });
      
      // Show success message
      alert("Thank you for your feedback! Your issue has been reported.");
      
      // Reset form and close dialog
      setIssueDescription("");
      setIsReportDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">Recipe not found</p>
          <Link to="/recipes">
            <Button>Back to Recipes</Button>
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "row", zIndex: 50 }}>
        <InfoIconButton />
        <LoginIconButton />
      </div>
      <div className="relative">
        {/* Enhanced image with proper loading states and click to view */}
        <div className="relative w-full">
          <EnhancedImage
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity duration-200"
            fallbackSrc="https://placehold.co/800x400/e2e8f0/64748b?text=Recipe+Image"
            onClick={() => setIsImageViewerOpen(true)}
            showLoadingSpinner={true}
            aspectRatio="video"
          />
          <div className="absolute top-4 left-4 z-10">
            <Link to="/recipes">
              <Button variant="secondary" size="sm" className="bg-card/80 backdrop-blur-sm hover:bg-card">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <FavoriteHeartButton recipeId={recipe.recipe_id.toString()} />
          </div>
        </div>
      </div>

      <main className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">{recipe.name}</h1>
            <div className="flex flex-wrap gap-2 justify-end">
              {recipe.categories && recipe.categories.length > 0 ? (
                recipe.categories.map((category, index) => (
                  <Badge key={index} variant="secondary">{category}</Badge>
                ))
              ) : (
                <Badge variant="secondary">Uncategorized</Badge>
              )}
            </div>
          </div>

          {/* Recipe Owner */}
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              Created by <span className="font-medium text-foreground">{recipe.owner_name}</span>
            </p>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center gap-4">
              <StarRating rating={recipe.rating || 0} showNumber />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                {recipe.views || 0} views
              </div>
              {recipe.difficulty && (
                <Badge variant="outline" className="gap-1">
                  <ChefHat className="w-3 h-3" />
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cook_time} min
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustServings(currentServings - 1)}
                  disabled={currentServings <= 1}
                  className="h-6 w-6 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="min-w-[60px] text-center">{currentServings} servings</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => adjustServings(currentServings + 1)}
                  disabled={currentServings >= 100}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="p-1 rounded hover:bg-accent transition flex items-center gap-1"
              title="Share recipe"
              type="button"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 mb-6 shadow-card">
          <div className="flex items-center gap-2 text-card-foreground">
            <span className="font-semibold">Nutrition</span>
            <span>-</span>
            <span className="text-muted-foreground">Calories</span>
            <span>-</span>
            <span className="font-semibold">{recipe.calories}</span>
          </div>
        </div>

        {recipe.youtube_url && getEmbedUrl(recipe.youtube_url) && (
          <>
            {/* Mobile YouTube Video - Keep current implementation */}
            <div className="mb-6 md:hidden">
              <div className="bg-card rounded-lg p-4 shadow-card">
                <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-primary" />
                  Video Tutorial
                </h3>
                <div className="aspect-video w-full">
                  <iframe
                    src={getEmbedUrl(recipe.youtube_url)}
                    title="Recipe Video Tutorial"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Desktop Floating YouTube Video */}
            <div className="hidden md:block fixed top-4 right-4 z-40 w-80 bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="bg-card p-2 flex items-center justify-between border-b">
                <h4 className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-primary" />
                  Video Tutorial
                </h4>
                <button
                  onClick={() => {
                    const iframe = document.querySelector('#floating-video') as HTMLIFrameElement;
                    if (iframe) {
                      // Toggle play/pause by reloading iframe (simple implementation)
                      const currentSrc = iframe.src;
                      iframe.src = '';
                      setTimeout(() => iframe.src = currentSrc, 100);
                    }
                  }}
                  className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Toggle
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  id="floating-video"
                  src={getEmbedUrl(recipe.youtube_url)}
                  title="Recipe Video Tutorial"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </>
        )}

        {recipe.calories && (
          <div className="mb-6">
            <div className="bg-card rounded-lg p-4 shadow-card">
              <h3 className="font-semibold text-card-foreground mb-2">Nutrition</h3>
              <p className="text-muted-foreground">{recipe.calories} calories per serving</p>
              {recipe.cuisine && (
                <p className="text-muted-foreground mt-1">Cuisine: {recipe.cuisine}</p>
              )}
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Ingredients</h2>
          <div className="bg-card rounded-lg shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold text-card-foreground">Ingredient</th>
                  <th className="text-right p-3 font-semibold text-card-foreground">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => {
                  const scaledQuantity = getScaledQuantity(parseFloat(ingredient.quantity.toString()) || 0, recipe.servings);
                  return (
                    <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-accent/10"}>
                      <td className="p-3 text-card-foreground capitalize">{ingredient.name}</td>
                      <td className="p-3 text-right text-card-foreground">
                        {!ingredient.quantity || ingredient.quantity === "0" ?
                          ingredient.unit :
                          formatQuantity(scaledQuantity, ingredient.unit)
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Instructions</h2>
          <div className="space-y-4">
            {recipe.instructions && recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4 p-4 bg-card rounded-lg shadow-card">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {typeof instruction === 'object' ? instruction.step : index + 1}
                </div>
                <p className="text-card-foreground">
                  {typeof instruction === 'object' ? instruction.description : instruction}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Cooking
          </Button>
          <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="px-6 gap-2">
                <AlertTriangle className="w-4 h-4" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report Recipe Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-accent/20 p-3 rounded-lg text-sm">
                  <p><strong>Recipe:</strong> {recipe.name}</p>
                  <p><strong>Category:</strong> {recipe.categories?.[0]}</p>
                  <p><strong>Recipe ID:</strong> {recipe.recipe_id}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issue-description">Issue Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Please describe the issue you found with this recipe (e.g., incorrect ingredients, missing steps, cooking time issues, etc.)"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsReportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleReportSubmit}
                    disabled={!issueDescription.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rating Section */}
        <section className="mb-8">
          <RatingInput
            recipeId={recipe.recipe_id}
            onRatingSubmitted={() => setRatingRefreshTrigger(prev => prev + 1)}
            onRatingDeleted={() => setRatingRefreshTrigger(prev => prev + 1)}
          />
        </section>

        <section className="mb-8">
          <RatingDisplay
            recipeId={recipe.recipe_id}
            refreshTrigger={ratingRefreshTrigger}
          />
        </section>
      </main>

      <BottomNavigation />

      {/* Image Viewer Modal */}
      <ImageViewer
        images={recipe.image_url ? [recipe.image_url] : []}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        alt={recipe.name}
      />
    </div>
  );
};

export default RecipeDetailPage;