import { ArrowLeft, Clock, Users, Youtube, Share2, Eye, Plus, Minus, AlertTriangle } from "lucide-react";
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
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useViewCounter } from "@/hooks/useViewCounter";
import pastaImage from "@/assets/pasta-vegetables.jpg";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const { incrementView, getViewCount } = useViewCounter();
  
  // Helper function to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || 'dQw4w9WgXcQ'; // fallback to Rick Roll
    return `https://www.youtube.com/embed/${videoId}`;
  };
  
  // Mock data - in a real app, you'd fetch based on id
  const recipeData = {
    "1": {
      id: "1",
      title: "Pasta with Vegetables",
      image: pastaImage,
      rating: 5,
      category: "Dinner",
      cookTime: "25 min",
      servings: 4,
      calories: 300,
      ingredients: [
        { name: "pasta", quantity: 200, unit: "g" },
        { name: "zucchini", quantity: 1, unit: "piece" },
        { name: "carrot", quantity: 1, unit: "piece" },
        { name: "tomatoes", quantity: 2, unit: "pieces" },
        { name: "olive oil", quantity: 2, unit: "tbsp" },
        { name: "salt and pepper", quantity: 0, unit: "to taste" },
        { name: "fresh herbs (basil, parsley)", quantity: 0, unit: "to taste" }
      ],
      instructions: [
        "Cook pasta according to package instructions until al dente.",
        "Meanwhile, dice the zucchini, carrot, and tomatoes.",
        "Heat olive oil in a large pan over medium heat.",
        "Add vegetables and cook for 5-7 minutes until tender.",
        "Drain pasta and add to the pan with vegetables.",
        "Toss everything together and season with salt and pepper.",
        "Garnish with fresh herbs and serve hot."
      ],
      videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "2": {
      id: "2",
      title: "Healthy Breakfast Bowl",
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
      rating: 4,
      category: "Breakfast",
      cookTime: "10 min",
      servings: 2,
      calories: 350,
      ingredients: [
        { name: "oats", quantity: 100, unit: "g" },
        { name: "banana", quantity: 1, unit: "piece" },
        { name: "berries", quantity: 150, unit: "g" },
        { name: "yogurt", quantity: 200, unit: "ml" },
        { name: "honey", quantity: 2, unit: "tbsp" },
        { name: "nuts", quantity: 30, unit: "g" }
      ],
      instructions: [
        "Cook oats according to package instructions.",
        "Slice the banana into rounds.",
        "In a bowl, layer the cooked oats.",
        "Top with yogurt, banana slices, and berries.",
        "Drizzle with honey and sprinkle with nuts.",
        "Serve immediately and enjoy!"
      ],
      videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    }
  };

  const recipe = recipeData[id as keyof typeof recipeData] || recipeData["1"];
  const [currentServings, setCurrentServings] = useState(recipe.servings);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  
  useEffect(() => {
    if (id) {
      incrementView(id);
    }
  }, [id, incrementView]);

  useEffect(() => {
    setCurrentServings(recipe.servings);
  }, [recipe.servings]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
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
    if (issueDescription.trim()) {
      // In a real app, this would send the report to your backend
      console.log("Report submitted:", {
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        category: recipe.category,
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


  return (
    <div className="min-h-screen bg-background pb-20" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "row", zIndex: 50 }}>
        <InfoIconButton />
        <LoginIconButton />
      </div>
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Link to="/recipes">
            <Button variant="secondary" size="sm" className="bg-card/80 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <main className="px-4 py-6">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">{recipe.title}</h1>
            <Badge variant="secondary">{recipe.category}</Badge>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center gap-4">
              <StarRating rating={recipe.rating} showNumber />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                {id && getViewCount(id)} views
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cookTime}
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

        {recipe.videoUrl && (
          <div className="mb-6">
            <div className="bg-card rounded-lg p-4 shadow-card">
              <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Youtube className="w-5 h-5 text-primary" />
                Video Tutorial
              </h3>
              <div className="aspect-video w-full">
                <iframe
                  src={getEmbedUrl(recipe.videoUrl)}
                  title="Recipe Video Tutorial"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
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
                {recipe.ingredients.map((ingredient, index) => {
                  const scaledQuantity = getScaledQuantity(ingredient.quantity, recipe.servings);
                  return (
                    <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-accent/10"}>
                      <td className="p-3 text-card-foreground capitalize">{ingredient.name}</td>
                      <td className="p-3 text-right text-card-foreground">
                        {ingredient.quantity === 0 ? ingredient.unit : formatQuantity(scaledQuantity, ingredient.unit)}
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
            {recipe.instructions.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 bg-card rounded-lg shadow-card">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-card-foreground">{step}</p>
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
                  <p><strong>Recipe:</strong> {recipe.title}</p>
                  <p><strong>Category:</strong> {recipe.category}</p>
                  <p><strong>Recipe ID:</strong> {recipe.id}</p>
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
      </main>

      <BottomNavigation />
    </div>
  );
};

export default RecipeDetailPage;