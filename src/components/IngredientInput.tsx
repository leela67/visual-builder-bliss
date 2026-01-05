import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { COOKING_UNITS, filterIngredients } from '@/data/ingredients';
import { Ingredient } from '@/api/recipeService';

interface IngredientInputProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, onChange }) => {
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    name: '',
    quantity: '',
    unit: ''
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle ingredient name input change
  const handleNameChange = (value: string) => {
    setCurrentIngredient(prev => ({ ...prev, name: value }));
    
    if (value.length >= 2) {
      const filteredSuggestions = filterIngredients(value, 8);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          selectSuggestion(suggestions[activeSuggestionIndex]);
        } else if (currentIngredient.name && currentIngredient.quantity && currentIngredient.unit) {
          addIngredient();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setCurrentIngredient(prev => ({ ...prev, name: suggestion }));
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  // Add ingredient to the list
  const addIngredient = () => {
    if (currentIngredient.name && currentIngredient.quantity && currentIngredient.unit) {
      const newIngredients = [...ingredients, { ...currentIngredient }];
      onChange(newIngredients);
      setCurrentIngredient({ name: '', quantity: '', unit: '' });
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onChange(newIngredients);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      {/* Current Ingredients List */}
      {ingredients.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Ingredients ({ingredients.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-accent/20 p-2 rounded-lg text-sm"
              >
                <span>
                  <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span> {ingredient.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                  className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Ingredient Form */}
      <div className="space-y-3 p-4 border rounded-lg bg-card">
        <h4 className="text-sm font-medium">Add Ingredient</h4>
        
        {/* Ingredient Name with Auto-suggestions */}
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="Ingredient name (e.g., carrot, chicken breast)"
            value={currentIngredient.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="w-full"
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                    index === activeSuggestionIndex ? 'bg-accent text-accent-foreground' : ''
                  }`}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quantity and Unit Row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Quantity (e.g., 2, 1/2)"
            value={currentIngredient.quantity}
            onChange={(e) => setCurrentIngredient(prev => ({ ...prev, quantity: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentIngredient.name && currentIngredient.quantity && currentIngredient.unit) {
                e.preventDefault();
                addIngredient();
              }
            }}
          />
          
          <Select
            value={currentIngredient.unit}
            onValueChange={(value) => setCurrentIngredient(prev => ({ ...prev, unit: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {COOKING_UNITS.map((unit) => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Button */}
        <Button
          type="button"
          onClick={addIngredient}
          disabled={!currentIngredient.name || !currentIngredient.quantity || !currentIngredient.unit}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </div>
    </div>
  );
};

export default IngredientInput;