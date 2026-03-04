import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/vyapaaro-logo.png";

const DesktopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Explore Shops", path: "/shops" },
    { label: "Saved", path: "/saved" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border sticky top-0 z-50">
      <button onClick={() => navigate("/")} className="flex items-center gap-2">
        <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
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
