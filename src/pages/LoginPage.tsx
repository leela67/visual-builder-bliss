import React, { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.login(phoneNumber.trim(), password);

      if (response.success) {
        toast.success("Login successful!");
        navigate("/"); // Redirect to home page
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col" style={{ position: "relative" }}>
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
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number (e.g., +1234567890)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
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
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
