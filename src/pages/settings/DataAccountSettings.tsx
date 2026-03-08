import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, PauseCircle, Trash2, FileText, Shield, HelpCircle, Loader2 } from "lucide-react";

const DataAccountSettings = () => {
  const navigate = useNavigate();
  const [deleting] = useState(false);

  const linkItems = [
    { icon: FileText, label: "Terms of Service", desc: "View our terms", action: () => navigate("/terms-of-service") },
    { icon: Shield, label: "Privacy Policy", desc: "How we protect your data", action: () => navigate("/privacy-policy") },
    { icon: HelpCircle, label: "Help & Support", desc: "Get assistance", action: () => navigate("/help-support") },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Data & Account</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your data and account</p>
      </div>

      {/* Data Actions */}
      <div className="space-y-1">
        <button
          onClick={() => toast({ title: "Coming soon", description: "Data download will be available soon." })}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Download className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Download My Data</p>
            <p className="text-xs text-muted-foreground">Get a copy of all your data</p>
          </div>
        </button>

        <button
          onClick={() => toast({ title: "Coming soon", description: "Account deactivation will be available soon." })}
          className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <PauseCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Deactivate Account</p>
            <p className="text-xs text-muted-foreground">Temporarily disable your account</p>
          </div>
        </button>

        {/* Delete Account */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-destructive/5 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-destructive">Delete Account Permanently</p>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => toast({ title: "Coming soon", description: "Account deletion will be available soon." })}
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Links */}
      <div className="border-t border-border pt-6 space-y-1">
        {linkItems.map(({ icon: Icon, label, desc, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataAccountSettings;
