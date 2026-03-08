import { useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserAvatar } from "@/hooks/useUserAvatar";

const DesktopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, initials, avatarUrl } = useUserAvatar();

  const links = [
    { label: "Home", path: "/" },
    { label: "Explore Shops", path: "/shops" },
    { label: "Saved", path: "/saved" },
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

        {/* Profile button with avatar */}
        <button
          onClick={() => navigate("/profile")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
            location.pathname === "/profile"
              ? "bg-white/20 text-primary-foreground"
              : "text-primary-foreground/70 hover:text-primary-foreground"
          }`}
        >
          {isLoggedIn && (avatarUrl || initials) ? (
            <Avatar className="h-6 w-6 border border-white/30">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
              <AvatarFallback className="text-[10px] bg-white/20 text-primary-foreground">
                {initials || <User className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
          ) : null}
          <span>Profile</span>
        </button>

        <ThemeToggle className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10" />
      </nav>
    </header>
  );
};

export default DesktopHeader;
