import { ArrowLeft, Clock, Users, Youtube } from "lucide-react";
import InfoIconButton from "../components/ui/InfoIconButton";
import LoginIconButton from "../components/ui/LoginIconButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StarRating from "@/components/StarRating";
import BottomNavigation from "@/components/BottomNavigation";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import pastaImage from "@/assets/pasta-vegetables.jpg";

const RecipeDetailPage = () => {
  const { id } = useParams();
  
  // Helper function to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || 'dQw4w9WgXcQ'; // fallback to Rick Roll
    return `https://www.youtube.com/embed/${videoId}`;
  };
  
  // Mock data - in a real app, you'd fetch based on id
  const recipe = {
    id: "1",
    title: "Pasta with Vegetables",
    image: pastaImage,
    rating: 5,
    category: "Dinner",
    cookTime: "25 min",
    servings: 4,
    calories: 300,
    ingredients: [
      "200g pasta",
      "1 zucchini",
      "1 carrot", 
      "2 tomatoes",
      "2 tbsp olive oil",
      "Salt and pepper to taste",
      "Fresh herbs (basil, parsley)"
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
          
          <StarRating rating={recipe.rating} showNumber />
          
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cookTime}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings} servings
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 mb-6 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-2">Nutrition</h3>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Calories</p>
              <p className="text-lg font-semibold text-card-foreground">{recipe.calories}</p>
            </div>
          </div>
        </div>

        {recipe.videoUrl && (
          <div className="mb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Youtube className="w-4 h-4" />
                  Watch Video Tutorial
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                  <DialogTitle>Video Tutorial - {recipe.title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video w-full">
                  <iframe
                    src={getEmbedUrl(recipe.videoUrl)}
                    title="Recipe Video Tutorial"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Ingredients</h2>
          <div className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-card">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                <span className="text-card-foreground">{ingredient}</span>
              </div>
            ))}
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
          <Button variant="outline" className="px-6">
            Save
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default RecipeDetailPage;