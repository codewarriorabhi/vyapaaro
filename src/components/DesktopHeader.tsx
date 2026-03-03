import { Home, Search, Heart, User, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const DesktopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Home", path: "/", icon: Home },
    { label: "Explore Shops", path: "/shops", icon: Search },
    { label: "Saved", path: "/saved", icon: Heart },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border sticky top-0 z-50">
      <button onClick={() => navigate("/")} className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">Vyapaaro</span>
      </button>
      <nav className="flex items-center gap-1">
        {links.map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default DesktopHeader;
