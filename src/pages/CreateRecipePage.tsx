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
import { RecipeService, type CreateRecipeRequest, type Ingredient, type Instruction } from "@/api/recipeService";
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS, type RecipeCategory, type DifficultyLevel } from "@/api/config";
import { toast } from "sonner";
import InfoIconButton from "../components/ui/InfoIconButton";
import beingHomeLogo from "/beinghomelogo.jpeg";

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
    name: "",
    category: "" as RecipeCategory | "",
    cook_time: 0,
    servings: 1,
    calories: 0,
    youtube_url: "",
    difficulty: "Medium" as DifficultyLevel,
    cuisine: "",
    tags: ""
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "" }]);
  const [instructions, setInstructions] = useState<Instruction[]>([{ step: 1, description: "" }]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    const newStep = instructions.length + 1;
    setInstructions([...instructions, { step: newStep, description: "" }]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const updated = instructions.filter((_, i) => i !== index);
      // Renumber steps
      const renumbered = updated.map((inst, i) => ({ ...inst, step: i + 1 }));
      setInstructions(renumbered);
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = { ...updated[index], description: value };
    setInstructions(updated);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, WebP, or SVG)");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image file size must be less than 5MB");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
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
    if (!formData.name.trim()) {
      toast.error("Please enter a recipe name");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (formData.cook_time <= 0) {
      toast.error("Please enter a valid cook time");
      return;
    }

    const filteredIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
    const filteredInstructions = instructions.filter(inst => inst.description.trim());

    if (filteredIngredients.length === 0) {
      toast.error("Please add at least one ingredient with name and quantity");
      return;
    }

    if (filteredInstructions.length === 0) {
      toast.error("Please add at least one instruction");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use FormData for multipart form submission when image is present
      if (selectedImage) {
        const formDataToSend = new FormData();
        
        // Add basic fields
        formDataToSend.append('name', formData.name.trim());
        formDataToSend.append('category', formData.category);
        formDataToSend.append('cook_time', formData.cook_time.toString());
        formDataToSend.append('servings', formData.servings.toString());
        formDataToSend.append('difficulty', formData.difficulty);
        formDataToSend.append('cuisine', formData.cuisine.trim() || "Other");
        formDataToSend.append('calories', formData.calories.toString());
        
        // Add optional fields
        if (formData.youtube_url.trim()) {
          formDataToSend.append('youtube_url', formData.youtube_url.trim());
        }
        if (formData.tags.trim()) {
          formDataToSend.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim())));
        }
        
        // Add image file
        formDataToSend.append('image', selectedImage);
        
        // Add ingredients and instructions as JSON strings
        formDataToSend.append('ingredients', JSON.stringify(filteredIngredients.map(ing => ({
          name: ing.name,
          quantity: `${ing.quantity}${ing.unit ? ' ' + ing.unit : ''}`
        }))));
        
        formDataToSend.append('instructions', JSON.stringify(filteredInstructions.map((inst, index) => ({
          step: index + 1,
          description: inst.description
        }))));

        const response = await RecipeService.createRecipeWithFormData(formDataToSend);

        if (response.success && response.data) {
          toast.success("Recipe created successfully!");
          navigate(`/recipes/${response.data.recipe_id}`);
        } else {
          toast.error(response.message || "Failed to create recipe");
        }
      } else {
        // Use JSON format when no image
        const recipeData: CreateRecipeRequest = {
          name: formData.name.trim(),
          category: formData.category,
          youtube_url: formData.youtube_url.trim() || undefined,
          cook_time: formData.cook_time,
          servings: formData.servings,
          difficulty: formData.difficulty,
          cuisine: formData.cuisine.trim() || "Other",
          calories: formData.calories,
          tags: formData.tags.trim() ? formData.tags.split(',').map(tag => tag.trim()) : [],
          ingredients: filteredIngredients,
          instructions: filteredInstructions
        };

        const response = await RecipeService.createRecipe(recipeData);

        if (response.success && response.data) {
          toast.success("Recipe created successfully!");
          navigate(`/recipes/${response.data.recipe_id}`);
        } else {
          toast.error(response.message || "Failed to create recipe");
        }
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20" style={{ position: "relative" }}>
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          {/* Logo and Info Button Row */}
          <div className="flex items-center justify-between mb-4">
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipeName" className="text-foreground font-medium">Recipe name *</Label>
            <Input
              id="recipeName"
              placeholder="Enter recipe name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className="bg-card border-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground font-medium">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => updateFormData('category', value as RecipeCategory)}>
              <SelectTrigger className="bg-card border-input">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {RECIPE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile" className="text-foreground font-medium">Recipe Image</Label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-full h-48 object-cover rounded-lg border border-input"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload a recipe image</p>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                    onChange={handleImageChange}
                    className="bg-card border-input"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPEG, PNG, WebP, SVG. Maximum size: 5MB
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-foreground font-medium">YouTube video link</Label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.youtube_url}
                onChange={(e) => updateFormData('youtube_url', e.target.value)}
                className="pl-10 bg-card border-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookTime" className="text-foreground font-medium">Cook Time (minutes) *</Label>
              <Input
                id="cookTime"
                placeholder="25"
                type="number"
                min="1"
                value={formData.cook_time || ''}
                onChange={(e) => updateFormData('cook_time', parseInt(e.target.value) || 0)}
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
              <Select value={formData.difficulty} onValueChange={(value) => updateFormData('difficulty', value as DifficultyLevel)}>
                <SelectTrigger className="bg-card border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
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
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="bg-card border-input flex-1"
                  />
                  <Input
                    placeholder="Qty"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    className="bg-card border-input w-20"
                  />
                  <Input
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="bg-card border-input w-20"
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
                  <div className="flex items-start gap-2 flex-1">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mt-1">
                      {instruction.step}
                    </div>
                    <Textarea
                      placeholder={`Describe step ${instruction.step}...`}
                      value={instruction.description}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="bg-card border-input flex-1"
                      rows={3}
                    />
                  </div>
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