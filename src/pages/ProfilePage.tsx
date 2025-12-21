
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Heart, LogOut, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";
import BottomNavigation from "@/components/BottomNavigation";
import type { User as UserType } from "@/api/auth";

const AVAILABLE_INTERESTS = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free", "Keto",
  "Low-Carb", "High-Protein", "Dairy-Free", "Nut-Free", "Spicy Food",
  "Sweet Dishes", "Healthy Eating", "Quick Meals", "Traditional Cuisine",
  "International Cuisine", "Baking", "Grilling", "Breakfast", "Desserts"
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    interests: [] as string[]
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.getUserProfile();

      if (response.success && response.data) {
        setUser(response.data);
        setEditForm({
          name: response.data.name || "",
          interests: response.data.interests || []
        });
      } else {
        toast.error(response.message || "Failed to load profile");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await AuthService.updateUserProfile(editForm.name, editForm.interests);

      if (response.success && response.data) {
        setUser(response.data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-20">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Profile</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      {/* Profile Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {user.phone_number}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background border-input"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-foreground bg-muted/30 p-3 rounded-md">{user.name}</p>
              )}
            </div>

            {/* Phone Number (Read-only) */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Phone Number</Label>
              <p className="text-muted-foreground bg-muted/30 p-3 rounded-md">{user.phone_number}</p>
              <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Interests
              </Label>
              {isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Select your food interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_INTERESTS.map((interest) => (
                      <Badge
                        key={interest}
                        variant={editForm.interests.includes(interest) ? "default" : "secondary"}
                        className={`cursor-pointer transition-colors ${
                          editForm.interests.includes(interest)
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-secondary/80"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.interests && user.interests.length > 0 ? (
                    user.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No interests selected</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: user.name || "",
                      interests: user.interests || []
                    });
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
