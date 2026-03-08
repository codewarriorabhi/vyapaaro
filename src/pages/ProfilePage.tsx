import { useNavigate } from "react-router-dom";
import { User, Settings, ChevronRight, LogIn, Store, Bell, HelpCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LogIn, label: "Login / Sign Up", desc: "Access your account", path: "/login" },
  { icon: Store, label: "My Shops", desc: "Manage your shop listings" },
  { icon: Bell, label: "Notifications", desc: "Offers & announcements" },
  { icon: Settings, label: "Settings", desc: "App preferences" },
  { icon: HelpCircle, label: "Help & Support", desc: "Get assistance" },
  { icon: Shield, label: "Privacy Policy", desc: "Your data protection" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  return (
    <div className="pb-20 md:pb-8 px-4 pt-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-6">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card mb-6"
      >
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
          <User className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Welcome to Vyapaaro</h2>
          <p className="text-sm text-muted-foreground">Sign in to manage your profile</p>
        </div>
      </motion.div>

      <div className="space-y-1">
        {menuItems.map(({ icon: Icon, label, desc, path }, i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => path && navigate(path)}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl hover:bg-card transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold">{label}</span>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
