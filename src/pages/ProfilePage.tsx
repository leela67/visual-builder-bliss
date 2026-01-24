import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Heart, LogOut, Edit, Save, X, Bell, BellDot, Trash2, Eye, EyeOff, ChefHat, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService } from "@/api/auth";
import { RecipeService, type RecipeListItem } from "@/api/recipeService";
import { NotificationService, type Notification } from "@/api/notificationService";
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

  // New state for recipes and notifications
  const [userRecipes, setUserRecipes] = useState<RecipeListItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchUserProfile();
    fetchUserRecipes();
    fetchNotifications();
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

  const fetchUserRecipes = async () => {
    try {
      setIsLoadingRecipes(true);
      const response = await RecipeService.getMyRecipes('all', 1, 50);
      
      if (response.success && response.data) {
        // Handle null recipes array by providing empty array fallback
        setUserRecipes(response.data.recipes || []);
      } else {
        console.error("Failed to fetch user recipes:", response.message);
        // Set empty array on error to prevent null reference issues
        setUserRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      // Set empty array on error to prevent null reference issues
      setUserRecipes([]);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const response = await NotificationService.getNotifications(1, 50);
      
      if (response.success && response.data) {
        // Handle null notifications array by providing empty array fallback
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      } else {
        console.error("Failed to fetch notifications:", response.message);
        // Set empty array on error to prevent null reference issues
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Set empty array on error to prevent null reference issues
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await NotificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev =>
          (prev || []).map(notif =>
            notif.id === notificationId
              ? { ...notif, is_read: true, read_at: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success("Notification marked as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const response = await NotificationService.deleteNotification(notificationId);
      if (response.success) {
        const deletedNotification = notifications?.find(n => n.id === notificationId);
        setNotifications(prev => (prev || []).filter(notif => notif.id !== notificationId));
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleEditRecipe = (recipeId: number) => {
    navigate(`/recipes/${recipeId}/edit`);
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
    <div className="min-h-screen bg-background pb-24 lg:pb-20">
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
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
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
        </div>
      </header>
      
      {/* Profile Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="recipes" className="gap-2">
              <ChefHat className="w-4 h-4" />
              My Recipes ({userRecipes?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              {unreadCount > 0 ? <BellDot className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
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
              
              {/* Terms and Privacy Policy Links */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">Legal</h3>
                <div className="space-y-2">
                  <Link
                    to="/terms"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* My Recipes Tab */}
          <TabsContent value="recipes" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">My Recipes</h2>
                <Button onClick={() => navigate('/create-recipe')} className="gap-2">
                  <ChefHat className="w-4 h-4" />
                  Create Recipe
                </Button>
              </div>
              
              {isLoadingRecipes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your recipes...</p>
                </div>
              ) : userRecipes && userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userRecipes.map((recipe) => (
                    <Card key={recipe.recipe_id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{recipe.name}</h3>
                          {recipe.is_approve === 1 && (
                            <Badge variant="default" className="text-xs bg-green-500">
                              Approved
                            </Badge>
                          )}
                          {recipe.is_approve === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Pending
                            </Badge>
                          )}
                          {recipe.is_approve === -1 && (
                            <Badge variant="destructive" className="text-xs">
                              Rejected
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {recipe.dietary_type}
                          </Badge>
                          {recipe.categories && (
                            Array.isArray(recipe.categories) ? (
                              recipe.categories.map((category, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                {recipe.categories}
                              </Badge>
                            )
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {recipe.cook_time}m
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {recipe.views} views
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRecipe(recipe.recipe_id)}
                            className="flex-1 gap-2"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No recipes yet</h3>
                  <p className="text-muted-foreground mb-4">Start creating your first recipe!</p>
                  <Button onClick={() => navigate('/create-recipe')} className="gap-2">
                    <ChefHat className="w-4 h-4" />
                    Create Your First Recipe
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge variant="secondary">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              
              {isLoadingNotifications ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading notifications...</p>
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={`${!notification.is_read ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{notification.title}</h4>
                              {!notification.is_read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-2"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
