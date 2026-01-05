// Comprehensive ingredient dataset for auto-suggestions
export const COOKING_UNITS = [
  // Volume
  { value: 'cup', label: 'cup' },
  { value: 'tbsp', label: 'tablespoon (tbsp)' },
  { value: 'tsp', label: 'teaspoon (tsp)' },
  { value: 'ml', label: 'milliliter (ml)' },
  { value: 'l', label: 'liter (l)' },
  { value: 'fl oz', label: 'fluid ounce (fl oz)' },
  
  // Weight
  { value: 'g', label: 'gram (g)' },
  { value: 'kg', label: 'kilogram (kg)' },
  { value: 'oz', label: 'ounce (oz)' },
  { value: 'lb', label: 'pound (lb)' },
  
  // Quantity
  { value: 'piece', label: 'piece' },
  { value: 'whole', label: 'whole' },
  { value: 'slice', label: 'slice' },
  { value: 'pinch', label: 'pinch' },
  { value: 'dash', label: 'dash' },
  
  // Other
  { value: 'to taste', label: 'to taste' },
  { value: 'as needed', label: 'as needed' },
];

export const COMMON_INGREDIENTS = [
  // Vegetables
  'carrot', 'carrots', 'carrot juice',
  'potato', 'potatoes', 'sweet potato', 'sweet potatoes',
  'tomato', 'tomatoes', 'cherry tomatoes', 'tomato paste', 'tomato sauce', 'tomato puree',
  'onion', 'onions', 'red onion', 'white onion', 'yellow onion', 'green onion', 'scallions',
  'garlic', 'garlic cloves', 'garlic powder', 'minced garlic',
  'bell pepper', 'red bell pepper', 'green bell pepper', 'yellow bell pepper',
  'broccoli', 'cauliflower', 'cabbage', 'lettuce', 'spinach', 'kale',
  'cucumber', 'zucchini', 'eggplant', 'mushrooms', 'button mushrooms', 'shiitake mushrooms',
  'celery', 'asparagus', 'green beans', 'peas', 'corn', 'corn kernels',
  'avocado', 'avocados', 'radish', 'beets', 'turnip', 'parsnip',
  
  // Fruits
  'apple', 'apples', 'green apple', 'red apple',
  'banana', 'bananas', 'orange', 'oranges', 'orange juice', 'orange zest',
  'lemon', 'lemons', 'lemon juice', 'lemon zest',
  'lime', 'limes', 'lime juice', 'lime zest',
  'strawberry', 'strawberries', 'blueberry', 'blueberries',
  'raspberry', 'raspberries', 'blackberry', 'blackberries',
  'grape', 'grapes', 'pineapple', 'mango', 'papaya',
  'peach', 'peaches', 'pear', 'pears', 'plum', 'plums',
  'cherry', 'cherries', 'watermelon', 'cantaloupe', 'honeydew',
  
  // Proteins
  'chicken', 'chicken breast', 'chicken thighs', 'chicken wings', 'ground chicken',
  'beef', 'ground beef', 'beef steak', 'beef roast', 'beef brisket',
  'pork', 'pork chops', 'pork tenderloin', 'ground pork', 'bacon', 'ham',
  'fish', 'salmon', 'tuna', 'cod', 'tilapia', 'shrimp', 'prawns',
  'crab', 'lobster', 'scallops', 'mussels', 'clams',
  'tofu', 'tempeh', 'seitan', 'eggs', 'egg whites', 'egg yolks',
  'turkey', 'ground turkey', 'turkey breast', 'lamb', 'duck',
  
  // Grains & Starches
  'rice', 'white rice', 'brown rice', 'basmati rice', 'jasmine rice', 'wild rice',
  'pasta', 'spaghetti', 'penne', 'fusilli', 'linguine', 'fettuccine',
  'bread', 'white bread', 'whole wheat bread', 'sourdough bread',
  'flour', 'all-purpose flour', 'whole wheat flour', 'bread flour', 'cake flour',
  'oats', 'rolled oats', 'steel cut oats', 'quinoa', 'barley', 'bulgur',
  'couscous', 'polenta', 'cornmeal', 'breadcrumbs', 'panko breadcrumbs',
  
  // Dairy & Alternatives
  'milk', 'whole milk', '2% milk', 'skim milk', 'almond milk', 'soy milk', 'coconut milk',
  'cheese', 'cheddar cheese', 'mozzarella cheese', 'parmesan cheese', 'feta cheese',
  'cream cheese', 'ricotta cheese', 'goat cheese', 'swiss cheese',
  'butter', 'unsalted butter', 'salted butter', 'margarine',
  'yogurt', 'greek yogurt', 'plain yogurt', 'vanilla yogurt',
  'heavy cream', 'whipping cream', 'half and half', 'sour cream',
  
  // Legumes & Nuts
  'beans', 'black beans', 'kidney beans', 'pinto beans', 'navy beans',
  'chickpeas', 'garbanzo beans', 'lentils', 'red lentils', 'green lentils',
  'almonds', 'walnuts', 'pecans', 'cashews', 'peanuts', 'pistachios',
  'pine nuts', 'hazelnuts', 'macadamia nuts', 'brazil nuts',
  'peanut butter', 'almond butter', 'tahini', 'sunflower seeds', 'pumpkin seeds',
  
  // Oils & Fats
  'olive oil', 'extra virgin olive oil', 'vegetable oil', 'canola oil',
  'coconut oil', 'sesame oil', 'avocado oil', 'sunflower oil',
  'cooking spray', 'shortening', 'lard',
  
  // Spices & Herbs (Fresh)
  'basil', 'fresh basil', 'oregano', 'fresh oregano', 'thyme', 'fresh thyme',
  'rosemary', 'fresh rosemary', 'sage', 'fresh sage', 'parsley', 'fresh parsley',
  'cilantro', 'fresh cilantro', 'dill', 'fresh dill', 'mint', 'fresh mint',
  'chives', 'fresh chives', 'tarragon', 'fresh tarragon',
  
  // Spices & Herbs (Dried)
  'salt', 'black pepper', 'white pepper', 'red pepper flakes',
  'paprika', 'cumin', 'coriander', 'turmeric', 'ginger powder',
  'cinnamon', 'nutmeg', 'cloves', 'allspice', 'cardamom',
  'bay leaves', 'dried oregano', 'dried basil', 'dried thyme',
  'garlic powder', 'onion powder', 'chili powder', 'cayenne pepper',
  'smoked paprika', 'curry powder', 'garam masala', 'italian seasoning',
  
  // Fresh Aromatics
  'fresh ginger', 'ginger root', 'fresh garlic', 'shallots',
  'lemongrass', 'galangal', 'fresh turmeric',
  
  // Condiments & Sauces
  'soy sauce', 'low sodium soy sauce', 'tamari', 'fish sauce',
  'worcestershire sauce', 'hot sauce', 'sriracha', 'tabasco',
  'ketchup', 'mustard', 'dijon mustard', 'yellow mustard',
  'mayonnaise', 'ranch dressing', 'italian dressing',
  'balsamic vinegar', 'white vinegar', 'apple cider vinegar', 'rice vinegar',
  'honey', 'maple syrup', 'agave nectar', 'brown sugar', 'white sugar',
  'vanilla extract', 'almond extract', 'lemon extract',
  
  // Canned & Jarred
  'canned tomatoes', 'diced tomatoes', 'crushed tomatoes', 'tomato sauce',
  'coconut milk', 'canned coconut milk', 'chicken broth', 'vegetable broth', 'beef broth',
  'canned beans', 'canned chickpeas', 'canned corn', 'pickles', 'olives',
  'capers', 'sun-dried tomatoes', 'roasted red peppers',
  
  // Baking Essentials
  'baking powder', 'baking soda', 'yeast', 'active dry yeast',
  'vanilla extract', 'cocoa powder', 'chocolate chips', 'dark chocolate',
  'powdered sugar', 'confectioners sugar', 'brown sugar', 'granulated sugar',
  'cornstarch', 'gelatin', 'cream of tartar',
  
  // International Ingredients
  'miso paste', 'rice wine vinegar', 'sesame seeds', 'nori', 'wasabi',
  'coconut flakes', 'curry leaves', 'fenugreek', 'asafoetida',
  'star anise', 'five spice powder', 'hoisin sauce', 'oyster sauce',
  'chipotle peppers', 'adobo sauce', 'masa harina', 'tortillas',
];

// Function to filter ingredients based on user input
export const filterIngredients = (query: string, limit: number = 10): string[] => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  
  // First, find exact matches and starts-with matches
  const exactMatches = COMMON_INGREDIENTS.filter(ingredient => 
    ingredient.toLowerCase() === lowerQuery
  );
  
  const startsWithMatches = COMMON_INGREDIENTS.filter(ingredient => 
    ingredient.toLowerCase().startsWith(lowerQuery) && 
    !exactMatches.includes(ingredient)
  );
  
  // Then, find contains matches
  const containsMatches = COMMON_INGREDIENTS.filter(ingredient => 
    ingredient.toLowerCase().includes(lowerQuery) && 
    !exactMatches.includes(ingredient) && 
    !startsWithMatches.includes(ingredient)
  );
  
  // Combine results with priority: exact > starts with > contains
  const results = [...exactMatches, ...startsWithMatches, ...containsMatches];
  
  return results.slice(0, limit);
};