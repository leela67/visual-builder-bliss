import React, { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import CountryCodeSelector from "../components/ui/CountryCodeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

const AVAILABLE_INTERESTS = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free", "Keto",
  "Low-Carb", "High-Protein", "Dairy-Free", "Nut-Free", "Spicy Food",
  "Sweet Dishes", "Healthy Eating", "Quick Meals", "Traditional Cuisine",
  "International Cuisine", "Baking", "Grilling", "Breakfast", "Desserts"
];

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      const response = await AuthService.register(
        fullPhoneNumber,
        password,
        name.trim(),
        interests
      );

      if (response.success) {
        toast.success("Registration successful!");
        navigate("/"); // Redirect to home page
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <header className="bg-card shadow-card border-b border-border w-full">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Register</h1>
            <div className="flex ml-auto gap-2">
              <InfoIconButton />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 py-8">
        <div className="bg-card rounded-xl shadow-lg border border-border p-6 sm:p-8 w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex gap-2">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                  className="flex-shrink-0"
                />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your phone number without the country code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <Label>Food Interests (Optional)</Label>
              <p className="text-sm text-muted-foreground">Select your food preferences:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      interests.includes(interest)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary/80"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              {interests.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Selected: {interests.join(", ")}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}