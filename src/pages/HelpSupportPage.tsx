import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, Mail, Phone, MessageCircle, Send, Loader2 } from "lucide-react";

const faqs = [
  {
    q: "How do I create a shop on Vyapaaro?",
    a: "Go to your Profile → My Shops → Add Shop. Fill in your shop details, upload photos, and publish. You'll need to sign up as a shop owner during registration.",
  },
  {
    q: "How do I edit my profile information?",
    a: "Navigate to Profile → Settings → Account. You can update your name, phone, address, and avatar from there.",
  },
  {
    q: "Can I list products in my shop?",
    a: "Yes! Once your shop is created, go to your shop page and tap 'Manage Products' to add, edit, or remove product listings.",
  },
  {
    q: "How do reviews work?",
    a: "Any logged-in user can leave a star rating and comment on a shop. Shop owners can reply to reviews from their shop dashboard.",
  },
  {
    q: "How do I reset my password?",
    a: "On the login page, tap 'Forgot Password'. Enter your email and follow the link sent to your inbox to set a new password.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We use industry-standard encryption and never share your personal data with third parties. You can review our Privacy Policy for full details.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings → Data & Account → Delete Account Permanently. This action is irreversible and removes all your data.",
  },
];

const HelpSupportPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSending(true);
    // Simulate sending — in production this would call an edge function
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="pb-24 md:pb-8 max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border py-3 flex items-center gap-3 -mx-4 px-4 md:static md:border-0 md:pt-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Help & Support</h1>
          <p className="text-xs text-muted-foreground">Find answers or reach out to us</p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <a
          href="mailto:codewarriorabhi@gmail.com"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Email Us</p>
            <p className="text-xs text-muted-foreground truncate">codewarriorabhi@gmail.com</p>
          </div>
        </a>
        <a
          href="tel:+919690960990"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Call Us</p>
            <p className="text-xs text-muted-foreground">+91 96909 60990</p>
          </div>
        </a>
        <a
          href="https://wa.me/919690960990"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-muted-foreground">Chat with us</p>
          </div>
        </a>
      </div>

      {/* FAQs */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-1">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-sm font-medium text-left py-3 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-3">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Form */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-3">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-xl border border-border bg-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="How can we help you?"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            {sending ? "Sending…" : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default HelpSupportPage;
