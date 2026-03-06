import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/vyapaaro-logo-new.png";

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
    <header className="hidden md:flex items-center justify-between px-6 py-3 gradient-primary border-b border-border sticky top-0 z-50">
      <button onClick={() => window.location.href = "/"} className="flex items-center">
        <img src={logo} alt="Vyapaaro" className="h-14 w-14 rounded-xl object-contain" />
      </button>
      <nav className="flex items-center gap-1">
        {links.map(({ label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive ? "bg-white/20 text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
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
