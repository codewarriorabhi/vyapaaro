import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { User, Store, Mail, Phone, MapPin, CheckCircle, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  surname: z.string().trim().min(1, "Surname is required").max(50),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15).regex(/^\+?[0-9]{10,15}$/, "Invalid phone format"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(500),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  userType: z.enum(["customer", "shop_owner"]),
});

type SignupForm = z.infer<typeof signupSchema>;

type VerificationStep = "form" | "email_otp" | "phone_otp" | "complete";

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<VerificationStep>("form");
  const [loading, setLoading] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formData, setFormData] = useState<SignupForm | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { userType: "customer" },
  });

  const userType = watch("userType");

  const onSubmitForm = async (data: SignupForm) => {
    setFormData(data);

    if (data.userType === "customer") {
      await createAccount(data);
    } else {
      // Shop owner → send email OTP first
      setLoading(true);
      try {
        const res = await supabase.functions.invoke("send-otp", {
          body: { type: "email", destination: data.email },
        });
        if (res.error) throw new Error(res.error.message);
        setStep("email_otp");
        toast({ title: "OTP Sent", description: "Check your email for the verification code." });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to send OTP", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  // Call external backend API to register user
  const registerWithBackendApi = async (data: SignupForm): Promise<boolean> => {
    const response = await api.post<{ message?: string }>("/auth/signup", {
      firstName: data.firstName,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      userType: data.userType,
    });

    if (response.error) {
      toast({ title: "Signup Failed", description: response.error, variant: "destructive" });
      return false;
    }

    return true;
  };

  const verifyEmailOtp = async () => {
    if (emailOtp.length !== 6) return;
    setLoading(true);
    try {
      const res = await supabase.functions.invoke("verify-otp", {
        body: { type: "email", destination: formData!.email, code: emailOtp },
      });
      if (res.error || !res.data?.verified) throw new Error("Invalid OTP");
      setEmailVerified(true);
      toast({ title: "Email Verified ✅" });

      // Now send phone OTP
      const phoneRes = await supabase.functions.invoke("send-otp", {
        body: { type: "phone", destination: formData!.phone },
      });
      if (phoneRes.error) throw new Error(phoneRes.error.message);
      setStep("phone_otp");
      toast({ title: "OTP Sent", description: "Check your phone for the SMS code." });
    } catch (err: any) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) return;
    setLoading(true);
    try {
      const res = await supabase.functions.invoke("verify-otp", {
        body: { type: "phone", destination: formData!.phone, code: phoneOtp },
      });
      if (res.error || !res.data?.verified) throw new Error("Invalid OTP");
      setPhoneVerified(true);
      toast({ title: "Phone Verified ✅" });
      await createAccount(formData!, true, true);
    } catch (err: any) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (data: SignupForm, emailV = false, phoneV = false) => {
    setLoading(true);
    try {
      // First register with external backend API
      const apiSuccess = await registerWithBackendApi(data);
      if (!apiSuccess) {
        setLoading(false);
        return;
      }

      // Then create Supabase auth account
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            surname: data.surname,
            phone: data.phone,
            address: data.address,
            role: data.userType,
            email_verified: emailV,
            phone_verified: phoneV,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;

      setStep("complete");
      toast({ title: "Account Created! 🎉", description: "Redirecting to login..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast({ title: "Signup Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (type: "email" | "phone") => {
    if (!formData) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("send-otp", {
        body: { type, destination: type === "email" ? formData.email : formData.phone },
      });
      toast({ title: "OTP Resent" });
    } catch {
      toast({ title: "Failed to resend", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---

  if (step === "complete") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md text-center shadow-card">
          <CardContent className="pt-10 pb-8 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
            <p className="text-muted-foreground">Welcome to Vyapaaro. Redirecting you to the home page…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "email_otp" || step === "phone_otp") {
    const isEmail = step === "email_otp";
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-card">
          <CardContent className="pt-8 pb-6 space-y-6">
            <button onClick={() => setStep("form")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {isEmail ? "Verify Your Email" : "Verify Your Phone"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-foreground">
                  {isEmail ? formData?.email : formData?.phone}
                </span>
              </p>
            </div>

            {/* Verification status */}
            <div className="flex gap-3 justify-center">
              <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${emailVerified ? "bg-accent/10 text-accent" : isEmail ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Mail className="h-3.5 w-3.5" />
                Email {emailVerified ? "✓" : isEmail ? "…" : ""}
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${phoneVerified ? "bg-accent/10 text-accent" : !isEmail ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Phone className="h-3.5 w-3.5" />
                Phone {phoneVerified ? "✓" : !isEmail ? "…" : ""}
              </div>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={isEmail ? emailOtp : phoneOtp}
                onChange={isEmail ? setEmailOtp : setPhoneOtp}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full"
              onClick={isEmail ? verifyEmailOtp : verifyPhoneOtp}
              disabled={loading || (isEmail ? emailOtp.length !== 6 : phoneOtp.length !== 6)}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify {isEmail ? "Email" : "Phone"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={() => resendOtp(isEmail ? "email" : "phone")}
                className="text-primary font-medium hover:underline"
                disabled={loading}
              >
                Resend
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="gradient-primary px-4 pt-10 pb-8 rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Create Account</h1>
            <p className="text-primary-foreground/70 text-sm">Join Vyapaaro marketplace</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        <Card className="shadow-card">
          <CardContent className="pt-6 pb-6">
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
              {/* User Type Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">I want to join as</Label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { value: "customer" as const, icon: User, label: "Customer", emoji: "👤", desc: "Browse & shop" },
                    { value: "shop_owner" as const, icon: Store, label: "Shop Owner", emoji: "🏪", desc: "List & sell" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("userType", opt.value)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        userType === opt.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/30 bg-card"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{opt.emoji}</span>
                      <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                      <span className="text-xs text-muted-foreground block">{opt.desc}</span>
                      {userType === opt.value && (
                        <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.userType && <p className="text-sm text-destructive">{errors.userType.message}</p>}
              </div>

              {userType === "shop_owner" && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-2 items-start">
                  <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Shop owners require <strong>email & phone verification</strong> before account activation.
                  </p>
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input id="firstName" placeholder="John" {...register("firstName")} />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="surname" className="text-sm">Surname</Label>
                  <Input id="surname" placeholder="Doe" {...register("surname")} />
                  {errors.surname && <p className="text-xs text-destructive">{errors.surname.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
                </Label>
                <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number
                </Label>
                <Input id="phone" type="tel" placeholder="+919876543210" {...register("phone")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Full Address
                </Label>
                <Textarea id="address" placeholder="Enter your full address…" className="min-h-[80px]" {...register("address")} />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input id="password" type="password" placeholder="Min 6 characters" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {userType === "shop_owner" ? "Continue to Verification" : "Create Account"}
              </Button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium gap-3"
                onClick={async () => {
                  try {
                    const { error } = await lovable.auth.signInWithOAuth("google", {
                      redirect_uri: window.location.origin,
                    });
                    if (error) throw error;
                  } catch (err: any) {
                    toast({ title: "Google Sign-In Failed", description: err.message, variant: "destructive" });
                  }
                }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">
                  Log in
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
