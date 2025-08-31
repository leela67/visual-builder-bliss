import { Search, ChefHat, CheckCircle, Instagram, Twitter, Facebook } from "lucide-react";
import InfoIconButton from "../components/ui/InfoIconButton";
import LoginIconButton from "../components/ui/LoginIconButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  // Placeholder social media posts
  const socialPosts = [
    {
      id: 1,
      platform: "instagram",
      user: "@recipemasters",
      content: "Check out this amazing pasta dish! 🍝 Simple ingredients, incredible flavor. What's your favorite comfort food?",
      likes: 124,
      time: "2h ago",
      image: pastaImage
    },
    {
      id: 2,
      platform: "twitter",
      user: "@healthyeats",
      content: "Starting your morning right with this nutritious breakfast bowl! 🥣 Packed with oats, fresh fruits, and energy for the day ahead.",
      likes: 89,
      time: "4h ago",
      image: breakfastImage
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
    <div className="min-h-screen bg-background pb-20" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "row", zIndex: 50 }}>
        <InfoIconButton />
        <LoginIconButton />
      </div>
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Recipes</h1>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search recipes..." 
              className="pl-10 bg-background border-input"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              onClick={handleWhatToCook}
              className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium gap-2 animate-glow"
            >
              <CheckCircle className="w-5 h-5" />
              What to Cook
            </Button>
            <Link to="/create-recipe">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-sm font-medium">
                Create Your Own Recipe
              </Button>
            </Link>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
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
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary transition">
                        <span>❤️</span>
                        <span>{post.likes} likes</span>
                      </button>
                      <button className="hover:text-primary transition">
                        Comment
                      </button>
                      <button className="hover:text-primary transition">
                        Share
                      </button>
                    </div>
                  </div>
                  
                  {post.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
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

      <BottomNavigation />
    </div>
  );
};

export default HomePage;