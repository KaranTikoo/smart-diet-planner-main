
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Search, 
  ShoppingBasket, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/meal-planner", label: "Meal Planner", icon: <CalendarDays className="h-5 w-5" /> },
    { path: "/food-search", label: "Food Search", icon: <Search className="h-5 w-5" /> },
    { path: "/groceries", label: "Grocery List", icon: <ShoppingBasket className="h-5 w-5" /> },
    { path: "/progress", label: "Progress", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
            <span>Logout</span>
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
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <span className="text-primary-foreground font-semibold">
                  {userEmail ? userEmail[0].toUpperCase() : "U"}
                </span>
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium">{userEmail || "User"}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 text-destructive border-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
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
