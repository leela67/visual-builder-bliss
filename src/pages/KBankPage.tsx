import { ArrowLeft, Utensils, Leaf, Fish, Cookie, Soup, Users, Heart, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Link } from "react-router-dom";

const KBankPage = () => {
  const foodCategories = [
    {
      id: "1",
      title: "Grains & Cereals",
      description: "Essential carbohydrates for energy and fiber for digestive health",
      icon: <Soup className="w-8 h-8" />,
      examples: ["Rice", "Wheat", "Oats", "Barley", "Quinoa"],
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-600"
    },
    {
      id: "2",
      title: "Fruits & Vegetables",
      description: "Rich in vitamins, minerals, and antioxidants for overall health",
      icon: <Leaf className="w-8 h-8" />,
      examples: ["Spinach", "Carrots", "Apples", "Berries", "Citrus"],
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    },
    {
      id: "3",
      title: "Proteins",
      description: "Building blocks for muscle growth and tissue repair",
      icon: <Fish className="w-8 h-8" />,
      examples: ["Fish", "Chicken", "Eggs", "Legumes", "Nuts"],
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      id: "4",
      title: "Dairy & Alternatives",
      description: "Calcium and protein sources for bone health and nutrition",
      icon: <Cookie className="w-8 h-8" />,
      examples: ["Milk", "Cheese", "Yogurt", "Almond Milk", "Tofu"],
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      id: "5",
      title: "Healthy Fats",
      description: "Essential fatty acids for brain function and hormone production",
      icon: <Utensils className="w-8 h-8" />,
      examples: ["Avocado", "Olive Oil", "Nuts", "Seeds", "Fatty Fish"],
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600"
    }
  ];

  const foodHabits = [
    {
      id: "1",
      title: "Vegetarian (Veg)",
      description: "A plant-focused diet excluding meat, poultry, fish, and seafood but may include dairy and eggs",
      icon: <Leaf className="w-8 h-8" />,
      included: ["Fruits", "Vegetables", "Grains", "Legumes", "Nuts", "Dairy", "Eggs"],
      excluded: ["All meat", "Poultry", "Fish", "Seafood"],
      benefits: ["Lower risk of heart disease", "Better weight management", "Higher fiber intake", "Reduced environmental impact"],
      challenges: ["Potential B12, iron deficiencies", "Requires nutritional planning"],
      examples: ["Vegetable stir-fry with tofu", "Cheese pizza with veggies", "Lentil soup"],
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    },
    {
      id: "2",
      title: "Non-Vegetarian (Non-Veg)",
      description: "Includes animal flesh along with plant-based foods - the most flexible and common global diet",
      icon: <Utensils className="w-8 h-8" />,
      included: ["All vegetarian foods", "Meat", "Poultry", "Fish", "Seafood"],
      excluded: ["None inherently"],
      benefits: ["High-quality complete proteins", "Essential amino acids", "Vitamin B12", "Iron and zinc"],
      challenges: ["Higher disease risk if over-reliant on processed meats", "Environmental concerns"],
      examples: ["Grilled chicken salad", "Fish curry with rice", "Beef stir-fry"],
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      id: "3",
      title: "Vegan",
      description: "Strict plant-based diet avoiding all animal products and by-products for ethical, health, or environmental reasons",
      icon: <Sprout className="w-8 h-8" />,
      included: ["Fruits", "Vegetables", "Grains", "Legumes", "Plant-based milks", "Tofu", "Nuts"],
      excluded: ["All animal products", "Meat", "Dairy", "Eggs", "Honey", "Gelatin"],
      benefits: ["Heart health", "Weight loss", "Lower cholesterol", "Environmental friendly", "Animal welfare"],
      challenges: ["Risk of B12, calcium deficiencies", "Social challenges", "Requires supplements"],
      examples: ["Avocado toast", "Chickpea salad with quinoa", "Vegan stir-fry with tofu"],
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600"
    },
    {
      id: "4",
      title: "Pescatarian",
      description: "Semi-vegetarian diet including fish and seafood but excluding other meats",
      icon: <Fish className="w-8 h-8" />,
      included: ["Vegetarian foods", "Fish", "Seafood", "Eggs", "Dairy"],
      excluded: ["Red meat", "Poultry", "Land animals"],
      benefits: ["Heart-healthy omega-3s", "High protein", "Easier than strict vegetarianism"],
      challenges: ["Mercury concerns in some fish", "Not fully plant-based"],
      examples: ["Grilled salmon with veggies", "Shrimp pasta", "Tuna salad sandwich"],
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      id: "5",
      title: "Flexitarian",
      description: "Flexible vegetarian diet that's mostly plant-based but occasionally includes meat or fish",
      icon: <Users className="w-8 h-8" />,
      included: ["Primarily vegetarian", "Moderate amounts of animal products"],
      excluded: ["None strictly - animal products minimized"],
      benefits: ["Plant health benefits with variety", "Easier to sustain", "Environmentally better"],
      challenges: ["Can be vague", "Requires mindful choices"],
      examples: ["Veggie burger most days", "Occasional chicken stir-fry"],
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    }
  ];

  const otherDiets = [
    { name: "Paleo", description: "Focuses on whole foods like meats, fish, fruits, veggies, nuts, and seeds, mimicking hunter-gatherer diet" },
    { name: "Keto", description: "High-fat, low-carb diet including meats, dairy, eggs, and low-carb veggies for ketosis" },
    { name: "Gluten-Free", description: "Avoids gluten (protein in wheat, barley) due to celiac disease or sensitivity" },
    { name: "Raw Food", description: "Emphasizes uncooked, unprocessed foods for enzyme preservation and detoxification" }
  ];

  return (
    <div className="min-h-screen bg-background pt-20" style={{ position: "relative" }}>
      {/* Fixed Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <BottomNavigation />
      </div>
      
      <header className="bg-card shadow-card border-b border-border">
        <div className="px-4 py-4">
          <p className="text-muted-foreground text-sm">
            Explore different types of foods and their nutritional benefits
          </p>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Understanding Food Habits</h2>
          <p className="text-muted-foreground">
            Different dietary preferences based on health, ethical, environmental, or cultural reasons
          </p>
        </div>

        <div className="grid gap-6">
          {foodHabits.map((habit) => (
            <Card key={habit.id} className={`${habit.color} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className={`${habit.iconColor} flex-shrink-0`}>
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground mb-2">
                      {habit.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">
                      {habit.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Included Foods:</h4>
                    <div className="flex flex-wrap gap-1">
                      {habit.included.map((food, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 border border-green-200 rounded text-xs text-green-800"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Excluded Foods:</h4>
                    <div className="flex flex-wrap gap-1">
                      {habit.excluded.map((food, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 border border-red-200 rounded text-xs text-red-800"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Benefits:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {habit.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Challenges:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {habit.challenges.map((challenge, index) => (
                        <li key={index}>• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm mb-2">Example Meals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {habit.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-background/60 border border-border rounded-full text-xs text-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Other Notable Dietary Approaches
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherDiets.map((diet, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">{diet.name}</h4>
                <p className="text-sm text-muted-foreground">{diet.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8 mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">Food Categories</h2>
          <p className="text-muted-foreground">
            Discover the essential food groups for a balanced and healthy diet
          </p>
        </div>

        <div className="grid gap-6">
          {foodCategories.map((category) => (
            <Card key={category.id} className={`${category.color} transition-all hover:shadow-md`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className={`${category.iconColor} flex-shrink-0`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground mb-2">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground text-sm">Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-background/60 border border-border rounded-full text-xs text-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Important Note</h4>
              <p className="text-sm text-yellow-700">
                Individual nutritional needs vary based on age, health conditions, and activity level. 
                Please consult with a healthcare professional or registered dietitian before making 
                major dietary changes to ensure the approach is right for your specific situation.
              </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default KBankPage;