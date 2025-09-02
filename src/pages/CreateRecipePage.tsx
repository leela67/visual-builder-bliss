import { useState } from "react";
import { ArrowLeft, Upload, Youtube, Plus, Minus, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { Link, useNavigate } from "react-router-dom";
import { RecipeAPI, type CreateRecipeRequest } from "@/api/recipes";
import { toast } from "sonner";

// Development helper function to export localStorage recipes
const exportRecipesToConsole = () => {
  const recipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
  console.log('=== EXPORTED RECIPES (Copy this to recipes-to-sync.json) ===');
  console.log(JSON.stringify({ 
    instructions: "Copy the recipes array below to recipes-to-sync.json and run 'npm run sync-recipes'",
    recipes 
  }, null, 2));
  console.log('=== END EXPORT ===');
  return recipes;
};

// Make it globally available for easy access
if (typeof window !== 'undefined') {
  (window as any).exportRecipesToConsole = exportRecipesToConsole;
}

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "",
    cookTime: "",
    servings: 1,
    calories: 0,
    videoUrl: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    cuisine: "",
    tags: ""
  });
  
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
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

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportRecipes = () => {
    const recipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
    
    if (recipes.length === 0) {
      toast.info("No recipes to export. Create some recipes first!");
      return;
    }

    // Create downloadable JSON file
    const exportData = {
      instructions: "This file contains your exported recipes. Run 'npm run sync-recipes' to sync them to MongoDB.",
      exportedAt: new Date().toISOString(),
      totalRecipes: recipes.length,
      recipes: recipes
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recipes-to-sync.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also export to console for manual copy if needed
    console.log('=== EXPORTED RECIPES FOR DATABASE SYNC ===');
    console.log(dataStr);
    console.log('=== END EXPORT ===');
    
    toast.success(`Downloaded ${recipes.length} recipe(s) to recipes-to-sync.json. Now run 'npm run sync-recipes' in terminal.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a recipe title");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    
    if (!formData.cookTime.trim()) {
      toast.error("Please enter cook time");
      return;
    }

    const filteredIngredients = ingredients.filter(ing => ing.trim());
    const filteredInstructions = instructions.filter(inst => inst.trim());
    
    if (filteredIngredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }
    
    if (filteredInstructions.length === 0) {
      toast.error("Please add at least one instruction");
      return;
    }

    setIsSubmitting(true);

    try {
      const recipeData: CreateRecipeRequest = {
        title: formData.title.trim(),
        image: formData.image.trim() || undefined,
        category: formData.category,
        cookTime: formData.cookTime.trim(),
        servings: formData.servings,
        calories: formData.calories,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        videoUrl: formData.videoUrl.trim() || undefined,
        difficulty: formData.difficulty,
        cuisine: formData.cuisine.trim() || undefined,
        tags: formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()) : undefined
      };

      const newRecipe = await RecipeAPI.createRecipe(recipeData);
      
      toast.success("Recipe created successfully!");
      navigate(`/recipes/${newRecipe._id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ position: "relative" }}>
      <header className="fixed top-0 left-0 right-0 bg-card shadow-card border-b border-border z-50">
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

      <main className="px-4 py-6 mt-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipeName" className="text-foreground font-medium">Recipe name *</Label>
            <Input 
              id="recipeName"
              placeholder="Enter recipe name"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="bg-card border-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground font-medium">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
              <SelectTrigger className="bg-card border-input">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Beverage">Beverage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-foreground font-medium">Image URL</Label>
            <Input 
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => updateFormData('image', e.target.value)}
              className="bg-card border-input"
            />
            <p className="text-xs text-muted-foreground">Paste an image URL or leave empty for default image</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-foreground font-medium">YouTube video link</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => updateFormData('videoUrl', e.target.value)}
                className="pl-10 bg-card border-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookTime" className="text-foreground font-medium">Cook Time *</Label>
              <Input 
                id="cookTime"
                placeholder="25 min"
                value={formData.cookTime}
                onChange={(e) => updateFormData('cookTime', e.target.value)}
                className="bg-card border-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings" className="text-foreground font-medium">Servings *</Label>
              <Input 
                id="servings"
                placeholder="4"
                type="number"
                min="1"
                value={formData.servings}
                onChange={(e) => updateFormData('servings', parseInt(e.target.value) || 1)}
                className="bg-card border-input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-foreground font-medium">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => updateFormData('difficulty', value)}>
                <SelectTrigger className="bg-card border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisine" className="text-foreground font-medium">Cuisine</Label>
              <Input 
                id="cuisine"
                placeholder="Italian, Asian, etc."
                value={formData.cuisine}
                onChange={(e) => updateFormData('cuisine', e.target.value)}
                className="bg-card border-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories" className="text-foreground font-medium">Calories</Label>
                <Input 
                  id="calories"
                  placeholder="300"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => updateFormData('calories', parseInt(e.target.value) || 0)}
                  className="bg-card border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-foreground font-medium">Tags</Label>
                <Input 
                  id="tags"
                  placeholder="healthy, quick, vegetarian"
                  value={formData.tags}
                  onChange={(e) => updateFormData('tags', e.target.value)}
                  className="bg-card border-input"
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Ingredients *</h3>
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
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`2 cups flour, 1 tsp salt, etc.`}
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="bg-card border-input flex-1"
                  />
                  {ingredients.length > 1 && (
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="px-2"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Instructions *</h3>
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
                <div key={index} className="flex gap-2">
                  <Textarea
                    placeholder={`Step ${index + 1}: Describe what to do...`}
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    className="bg-card border-input flex-1"
                    rows={3}
                  />
                  {instructions.length > 1 && (
                    <Button 
                      type="button"
                      variant="outline" 
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      className="px-2 self-start mt-1"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Recipe...
                </>
              ) : (
                "Publish Recipe"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportRecipes}
              className="px-6 py-3 gap-2"
              title="Export all localStorage recipes for syncing to database"
            >
              <Download className="w-4 h-4" />
              Sync to DB
            </Button>
          </div>
        </form>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CreateRecipePage;