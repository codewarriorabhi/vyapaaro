import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Lock, Shield, Activity, LogOut, Loader2 } from "lucide-react";

const SecuritySettings = () => {
  const navigate = useNavigate();
  const [twoFactor, setTwoFactor] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutAll = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut({ scope: "global" });
      toast({ title: "Logged out from all devices" });
      navigate("/login");
    } catch {
      toast({ title: "Failed to logout", variant: "destructive" });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Security Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Keep your account safe and secure</p>
      </div>

      <div className="space-y-1">
        {/* Change Password */}
        <button
          onClick={() => toast({ title: "Coming soon", description: "Password change will be available soon." })}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Change Password</p>
            <p className="text-xs text-muted-foreground">Update your account password</p>
          </div>
        </button>

        {/* 2FA */}
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <Label htmlFor="two_factor" className="font-medium cursor-pointer">Two-Factor Authentication</Label>
              <p className="text-xs text-muted-foreground">Add an extra layer of security with OTP</p>
            </div>
          </div>
          <Switch id="two_factor" checked={twoFactor} onCheckedChange={setTwoFactor} />
        </div>

        {/* Login Activity */}
        <button
          onClick={() => toast({ title: "Coming soon", description: "Login activity will be available soon." })}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">View Login Activity</p>
            <p className="text-xs text-muted-foreground">See where your account is logged in</p>
          </div>
        </button>

        {/* Logout All */}
        <button
          onClick={handleLogoutAll}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-destructive/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            {loggingOut ? <Loader2 className="h-4 w-4 text-destructive animate-spin" /> : <LogOut className="h-4 w-4 text-destructive" />}
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-destructive">Logout from All Devices</p>
            <p className="text-xs text-muted-foreground">Sign out everywhere</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
