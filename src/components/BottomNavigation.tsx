import { Home, BookOpen, Heart, User, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Recipes", path: "/recipes" },
    { icon: Plus, label: "Create", path: "/create-recipe", isSpecial: true },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    // Only show on mobile/tablet (hidden on lg and above)
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Floating container with gap from bottom */}
      <div className="px-4 pb-3">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 touch-manipulation min-w-[56px] ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Active indicator - elevated background */}
                  {active && (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl -top-3 shadow-lg border-2 border-primary/20" />
                  )}

                  {/* Icon container with special styling for Create button */}
                  <div className={`relative z-10 transition-all duration-300 ${
                    item.isSpecial && active
                      ? "bg-primary text-primary-foreground rounded-full p-2 -mt-2 shadow-lg scale-110"
                      : item.isSpecial
                      ? "bg-primary/90 text-primary-foreground rounded-full p-2 -mt-2 shadow-md"
                      : active
                      ? "scale-110"
                      : ""
                  }`}>
                    <Icon size={item.isSpecial ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
                  </div>

                  {/* Label */}
                  <span className={`relative z-10 text-[10px] font-medium transition-all duration-300 ${
                    active ? "font-semibold" : ""
                  } ${item.isSpecial ? "mt-1" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;