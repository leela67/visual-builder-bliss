import React, { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import CountryCodeSelector from "../components/ui/CountryCodeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !password.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-center",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      const response = await AuthService.login(fullPhoneNumber, password);

      if (response.success) {
        toast.success("Login successful!", {
          position: "top-center",
          duration: 3000,
        });
        navigate("/"); // Redirect to home page
      } else {
        toast.error(response.message || "Login failed", {
          position: "top-center",
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-20 flex flex-col" style={{ position: "relative" }}>
      <header className="bg-card shadow-card border-b border-border w-full">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Login</h1>
            <div className="flex ml-auto gap-2">
              <InfoIconButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 py-8">
        <div className="bg-card rounded-xl shadow-lg border border-border p-6 sm:p-8 w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-right text-sm text-muted-foreground mb-4">
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            New user?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register
            </Link>
          </div>
          
          {/* Terms and Privacy Policy Links */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            By logging in, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms and Conditions
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
