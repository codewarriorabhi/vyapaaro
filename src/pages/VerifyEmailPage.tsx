import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);

  // Listen for auth state changes (user clicks the link in email)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
          setVerified(true);
          toast({ title: "Email Verified! ✅", description: "Your account is now active." });
          setTimeout(() => navigate("/profile"), 2000);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleResend = async () => {
    if (!email) {
      toast({ title: "Error", description: "No email address found.", variant: "destructive" });
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast({ title: "Email Sent! 📧", description: "Check your inbox for the verification link." });
    } catch (err: any) {
      toast({ title: "Failed to resend", description: err.message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        setVerified(true);
        toast({ title: "Email Verified! ✅" });
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        toast({ title: "Not yet verified", description: "Please check your email and click the verification link.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error checking status", variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center shadow-card">
          <CardContent className="pt-10 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Email Verified!</h2>
            <p className="text-muted-foreground">Your account is active. Redirecting…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="gradient-primary px-4 pt-10 pb-8 rounded-b-3xl">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Verify Your Email</h1>
            <p className="text-primary-foreground/70 text-sm">One last step to activate your account</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        <Card className="shadow-card">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Check Your Inbox</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification link to
                </p>
                {email && (
                  <p className="text-sm font-semibold text-foreground bg-muted px-4 py-2 rounded-lg inline-block">
                    {email}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to verify your account and start using Vyapaaro.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={handleCheckStatus}
                disabled={checking}
              >
                {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                I've verified, check status
              </Button>

              <Button
                variant="ghost"
                className="w-full h-11 text-sm"
                onClick={handleResend}
                disabled={resending}
              >
                {resending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Didn't receive it? Resend email
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs font-medium text-foreground">💡 Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure <span className="font-medium">{email || "your email"}</span> is correct</li>
                <li>The link expires in 24 hours</li>
              </ul>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Wrong email?{" "}
              <button onClick={() => navigate("/signup")} className="text-primary font-medium hover:underline">
                Sign up again
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
