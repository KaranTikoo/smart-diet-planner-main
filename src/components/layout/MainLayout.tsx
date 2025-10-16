import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Search, 
  ShoppingBasket, 
  Package, // New import for inventory icon
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider"; // Import useAuth
import { useProfile } from "@/hooks/useProfile"; // Import useProfile hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth(); // Get user, isGuest, and signOut from useAuth
  const { profile } = useProfile(); // Get profile data
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(); // Use the signOut function from useAuth
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/meal-planner", label: "Meal Planner", icon: <CalendarDays className="h-5 w-5" /> },
    { path: "/food-search", label: "Food Search", icon: <Search className="h-5 w-5" /> },
    { path: "/groceries", label: "Grocery List", icon: <ShoppingBasket className="h-5 w-5" /> },
    { path: "/inventory", label: "Inventory", icon: <Package className="h-5 w-5" /> }, // New navigation item
    { path: "/progress", label: "Progress", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const displayUserName = isGuest ? "Guest" : (profile?.full_name || user?.email || "User");
  const displayUserInitial = isGuest ? "G" : (profile?.full_name ? profile.full_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : "U"));
  const logoutButtonText = isGuest ? "Exit Guest Mode" : "Logout";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <header className="md:hidden bg-card border-b p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center">
          <span className="font-bold text-lg text-primary">Smart Diet Planner</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-card p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors ${
                location.pathname === item.path ? "bg-primary text-primary-foreground" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className="flex items-center justify-start gap-3 px-4 py-3 mt-2 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>{logoutButtonText}</span>
          </Button>
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card border-r">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex items-center h-16 px-4 border-b">
            <Link to="/dashboard" className="flex items-center">
              <span className="font-bold text-lg text-primary">Smart Diet Planner</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors ${
                  location.pathname === item.path ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-4 py-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} alt="User Avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {displayUserInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium">{displayUserName}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 text-destructive border-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>{logoutButtonText}</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;