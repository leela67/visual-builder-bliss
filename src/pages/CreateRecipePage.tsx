import { useState } from "react";
import { ArrowLeft, Upload, Youtube, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Link } from "react-router-dom";

const CreateRecipePage = () => {
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/recipes">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Create Recipe</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipeName" className="text-foreground font-medium">Recipe name</Label>
            <Input 
              id="recipeName"
              placeholder="Enter recipe name"
              className="bg-card border-input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Upload photo</Label>
            <Card className="border-2 border-dashed border-border p-8 text-center bg-card hover:bg-accent/10 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">Tap to upload image</p>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-foreground font-medium">YouTube video link</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                className="pl-10 bg-card border-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookTime" className="text-foreground font-medium">Cook Time</Label>
              <Input 
                id="cookTime"
                placeholder="25 min"
                className="bg-card border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings" className="text-foreground font-medium">Servings</Label>
              <Input 
                id="servings"
                placeholder="4"
                type="number"
                className="bg-card border-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Nutrition</h3>
            <div className="space-y-2">
              <Label htmlFor="calories" className="text-foreground font-medium">Calories</Label>
              <Input 
                id="calories"
                placeholder="300"
                type="number"
                className="bg-card border-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Ingredients</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addIngredient}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <Input
                  key={index}
                  placeholder={`Ingredient ${index + 1}`}
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  className="bg-card border-input"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Instructions</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addInstruction}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <Textarea
                  key={index}
                  placeholder={`Step ${index + 1}`}
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  className="bg-card border-input"
                  rows={3}
                />
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
          >
            Publish
          </Button>
        </form>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CreateRecipePage;