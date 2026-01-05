import { useState, useEffect } from "react";
import { ArrowLeft, Upload, Youtube, Plus, Minus, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeService, type CreateRecipeRequest, type Ingredient, type Instruction, type Recipe } from "@/api/recipeService";
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS, CUISINE_TYPES, DIETARY_TYPES, type RecipeCategory, type DifficultyLevel, type CuisineType, type DietaryType } from "@/api/config";
import { toast } from "sonner";
import InfoIconButton from "../components/ui/InfoIconButton";
import beingHomeLogo from "/beinghomelogo.jpeg";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ImageCropper from "@/components/ImageCropper";
import EnhancedImageUpload from "@/components/EnhancedImageUpload";

// Pre-defined options for tags
const COMMON_TAGS = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb",
  "High-Protein", "Healthy", "Quick", "Easy", "Comfort Food", "Spicy",
  "Sweet", "Savory", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert",
  "Appetizer", "Main Course", "Side Dish", "Soup", "Salad", "Beverage"
];

const EditRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    categories: [] as RecipeCategory[],
    dietary_type: "Veg" as DietaryType,
    cook_time: 0,
    servings: 1,
    calories: "" as string | number,
    youtube_url: "",
    difficulty: "Medium" as DifficultyLevel,
    cuisine: "" as CuisineType | "",
    tags: [] as string[]
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "", unit: "" }]);
  const [instructions, setInstructions] = useState<Instruction[]>([{ step: 1, description: "" }]);
  
  // State for custom tag input
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    if (id) {
      fetchRecipe(parseInt(id));
    } else {
      navigate('/profile');
    }
  }, [id, navigate]);

  const fetchRecipe = async (recipeId: number) => {
    try {
      setIsLoading(true);
      const response = await RecipeService.getRecipeById(recipeId);
      
      if (response.success && response.data) {
        const recipeData = response.data;
        setRecipe(recipeData);
        
        // Pre-populate form data
        setFormData({
          name: recipeData.name || "",
          categories: Array.isArray(recipeData.categories) ? recipeData.categories : [],
          dietary_type: recipeData.dietary_type || "Veg",
          cook_time: recipeData.cook_time || 0,
          servings: recipeData.servings || 1,
          calories: recipeData.calories || "",
          youtube_url: recipeData.youtube_url || "",
          difficulty: recipeData.difficulty || "Medium",
          cuisine: (recipeData.cuisine as CuisineType) || "",
          tags: recipeData.tags || []
        });

        // Set existing image preview
        if (recipeData.image_url) {
          setImagePreview(recipeData.image_url);
        }

        // Set ingredients
        if (recipeData.ingredients && recipeData.ingredients.length > 0) {
          setIngredients(recipeData.ingredients);
        }

        // Set instructions
        if (recipeData.instructions && recipeData.instructions.length > 0) {
          setInstructions(recipeData.instructions.map((inst, index) => ({
            step: index + 1,
            description: inst.description
          })));
        }
      } else {
        toast.error("Failed to load recipe data");
        navigate('/profile');
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("Failed to load recipe data");
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for tags
  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      updateFormData('tags', [...formData.tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Helper functions for categories
  const addCategory = (category: RecipeCategory) => {
    if (!formData.categories.includes(category)) {
      updateFormData('categories', [...formData.categories, category]);
    }
  };

  const removeCategory = (categoryToRemove: RecipeCategory) => {
    updateFormData('categories', formData.categories.filter(cat => cat !== categoryToRemove));
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

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

      // Show image cropper instead of directly setting the image
      setTempImageFile(file);
      setShowImageCropper(true);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    setSelectedImage(croppedFile);
    
    // Create preview for the cropped image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(croppedFile);
    
    setShowImageCropper(false);
    setTempImageFile(null);
    toast.success("Image cropped successfully!");
  };

  const handleCropCancel = () => {
    setShowImageCropper(false);
    setTempImageFile(null);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(recipe?.image_url || null); // Revert to original image
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Recipe ID is missing");
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter a recipe name");
      return;
    }

    if (formData.categories.length === 0) {
      toast.error("Please select at least one category");
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
      // Prepare recipe data for update
      const recipeData: Partial<CreateRecipeRequest> = {
        name: formData.name.trim(),
        categories: formData.categories,
        dietary_type: formData.dietary_type,
        youtube_url: formData.youtube_url.trim() || undefined,
        cook_time: formData.cook_time,
        servings: formData.servings,
        difficulty: formData.difficulty,
        cuisine: formData.cuisine || "Other",
        calories: typeof formData.calories === 'number' ? formData.calories : parseInt(formData.calories) || 0,
        tags: formData.tags,
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      };

      // If there's a new image, we need to handle it separately
      // For now, we'll just update the recipe data without the image
      // TODO: Implement image update functionality if needed

      const response = await RecipeService.editRecipe(parseInt(id), recipeData);

      if (response.success && response.data) {
        toast.success("Recipe updated successfully!");
        navigate('/profile');
      } else {
        toast.error(response.message || "Failed to update recipe");
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error("Failed to update recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

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
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Edit Recipe</h1>
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

          {/* Categories Multi-Select */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium flex items-center gap-2">
              Categories *
            </Label>
            
            {/* Selected Categories Display */}
            {formData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md">
                {formData.categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    onClick={() => removeCategory(category)}
                  >
                    {category}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Categories Selection */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Select categories for your recipe:</p>
              <div className="flex flex-wrap gap-2">
                {RECIPE_CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={formData.categories.includes(category) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      formData.categories.includes(category)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary/80"
                    }`}
                    onClick={() => {
                      if (formData.categories.includes(category)) {
                        removeCategory(category);
                      } else {
                        addCategory(category);
                      }
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Dietary Type */}
          <div className="space-y-2">
            <Label htmlFor="dietary_type" className="text-foreground font-medium">Dietary Type *</Label>
            <Select value={formData.dietary_type} onValueChange={(value) => updateFormData('dietary_type', value as DietaryType)}>
              <SelectTrigger className="bg-card border-input">
                <SelectValue placeholder="Select dietary type" />
              </SelectTrigger>
              <SelectContent>
                {DIETARY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Recipe Image</Label>
            <EnhancedImageUpload
              onImageSelect={(file, preview) => {
                setTempImageFile(file);
                setShowImageCropper(true);
              }}
              currentImage={imagePreview}
              onRemoveImage={removeImage}
              maxSizeMB={5}
              acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']}
            />
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
              <Select value={formData.cuisine} onValueChange={(value) => updateFormData('cuisine', value as CuisineType)}>
                <SelectTrigger className="bg-card border-input">
                  <SelectValue placeholder="Select cuisine type" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINE_TYPES.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calories" className="text-foreground font-medium">Calories</Label>
            <Input
              id="calories"
              placeholder="Enter calories (e.g., 300)"
              type="number"
              min="0"
              value={formData.calories}
              onChange={(e) => updateFormData('calories', e.target.value === '' ? '' : parseInt(e.target.value) || '')}
              className="bg-card border-input"
            />
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

          {/* Tags Section */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium flex items-center gap-2">
              Tags
            </Label>
            
            {/* Selected Tags Display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags Selection */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Select tags for your recipe:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.tags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      formData.tags.includes(tag)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary/80"
                    }`}
                    onClick={() => {
                      if (formData.tags.includes(tag)) {
                        removeTag(tag);
                      } else {
                        addTag(tag);
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomTagAdd();
                  }
                }}
                className="bg-card border-input flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCustomTagAdd}
                disabled={!customTag.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Updating Recipe...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Update Recipe
              </>
            )}
          </Button>
        </form>
      </main>

      {/* Image Cropper Modal */}
      {showImageCropper && tempImageFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ImageCropper
            imageFile={tempImageFile}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={16 / 9} // Standard recipe image aspect ratio
          />
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default EditRecipePage;