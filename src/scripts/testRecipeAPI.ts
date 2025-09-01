import { RecipeAPI } from '../api/recipes';

async function testRecipeAPI() {
  console.log('🧪 Testing Recipe API...');

  try {
    // Test creating a recipe
    console.log('\n1. Testing recipe creation...');
    const newRecipeData = {
      title: "Test API Recipe",
      category: "Dinner" as const,
      cookTime: "30 min",
      servings: 4,
      calories: 400,
      ingredients: [
        "2 cups rice",
        "1 onion, chopped",
        "2 tbsp oil",
        "Salt to taste"
      ],
      instructions: [
        "Heat oil in a pan",
        "Add chopped onion and cook until golden",
        "Add rice and water, cook for 20 minutes",
        "Season with salt and serve hot"
      ],
      difficulty: "Easy" as const,
      cuisine: "Asian",
      tags: ["test", "api", "quick"]
    };

    const createdRecipe = await RecipeAPI.createRecipe(newRecipeData);
    console.log('✅ Recipe created successfully:', createdRecipe.title);

    // Test fetching the recipe
    console.log('\n2. Testing recipe fetching...');
    const fetchedRecipe = await RecipeAPI.getRecipe(createdRecipe._id!);
    console.log('✅ Recipe fetched successfully:', fetchedRecipe?.title);

    // Test fetching all recipes
    console.log('\n3. Testing recipes listing...');
    const allRecipes = await RecipeAPI.getRecipes({ limit: 5 });
    console.log(`✅ Fetched ${allRecipes.length} recipes`);

    // Test incrementing view count
    console.log('\n4. Testing view count increment...');
    await RecipeAPI.incrementViewCount(createdRecipe._id!);
    const updatedViewCount = await RecipeAPI.getViewCount(createdRecipe._id!);
    console.log(`✅ View count updated to: ${updatedViewCount}`);

    // Test featured recipes
    console.log('\n5. Testing featured recipes...');
    const featuredRecipes = await RecipeAPI.getFeaturedRecipes(3);
    console.log(`✅ Fetched ${featuredRecipes.length} featured recipes`);

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRecipeAPI();