import { Home, Search, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserAvatar } from "@/hooks/useUserAvatar";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, initials, avatarUrl } = useUserAvatar();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/shops" },
    { icon: Heart, label: "Saved", path: "/saved" },
    { label: "Profile", path: "/profile", isProfile: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ icon: Icon, label, path, isProfile }) => {
          const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

          if (isProfile) {
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {isLoggedIn && (avatarUrl || initials) ? (
                  <Avatar className={`h-5 w-5 ${isActive ? "ring-2 ring-primary" : ""}`}>
                    {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                      {initials || <User className="h-3 w-3" />}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                )}
                <span className="text-[10px] font-semibold">{label}</span>
              </button>
            );
          }

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {Icon && <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />}
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
