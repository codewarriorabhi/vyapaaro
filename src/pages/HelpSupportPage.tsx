import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, ShoppingBag, Store, UserCircle, CreditCard, Shield, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  icon: React.ElementType;
  items: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    label: "Getting Started",
    icon: UserCircle,
    items: [
      { q: "How do I create an account?", a: "Tap Sign Up on the login page, fill in your details (name, email, phone, password), and verify your email to get started." },
      { q: "How do I edit my profile?", a: "Go to your Profile page and tap the edit icon next to your name. You can update your name, phone, address, and profile photo." },
      { q: "Do I need an account to browse shops?", a: "You can browse shops without an account, but you need to sign in to save items, place orders, or leave reviews." },
    ],
  },
  {
    label: "Shops & Discovery",
    icon: Store,
    items: [
      { q: "How do I find shops near me?", a: "Use the Explore tab to browse all shops. You can filter by category or use the search bar to find specific shops." },
      { q: "How are shops sorted?", a: "Shops can be sorted by name or newest first. You can also filter by category and minimum rating." },
      { q: "Can I save a shop for later?", a: "Yes! Tap the heart icon on any shop card to save it. View all saved items from the Saved tab." },
    ],
  },
  {
    label: "Orders & Inquiries",
    icon: ShoppingBag,
    items: [
      { q: "How do I place an order?", a: "Visit a shop's profile, browse their products, and tap 'Place Order'. Fill in the details and submit your request." },
      { q: "How do I track my orders?", a: "Go to your Profile → Orders to see all your past and active orders." },
      { q: "Can I cancel an order?", a: "Contact the shop owner directly via phone or WhatsApp from the shop's profile page to discuss cancellations." },
    ],
  },
  {
    label: "Reviews & Ratings",
    icon: Star,
    items: [
      { q: "How do I leave a review?", a: "Visit a shop's profile page, scroll to the Reviews section, and tap 'Write a Review'. Select a star rating and add your comment." },
      { q: "Can I edit or delete my review?", a: "Yes, you can update or delete your own reviews from the shop's review section." },
      { q: "Can shop owners reply to reviews?", a: "Yes, shop owners can reply to any review left on their shop." },
    ],
  },
  {
    label: "Shop Owners",
    icon: CreditCard,
    items: [
      { q: "How do I register my shop?", a: "Go to Profile → My Shops → Add Shop. Fill in your shop details, upload photos, and submit. Your shop will be live immediately." },
      { q: "How do I manage my shop's products?", a: "From your shop's profile, tap 'Manage Products' to add, edit, or remove products." },
      { q: "Where can I see my shop analytics?", a: "Go to your shop's profile and tap 'Analytics' to view visits, calls, WhatsApp clicks, and other engagement data." },
    ],
  },
  {
    label: "Privacy & Security",
    icon: Shield,
    items: [
      { q: "How is my data protected?", a: "We use industry-standard encryption and secure authentication. Your personal data is never shared with third parties without consent." },
      { q: "How do I change my password?", a: "Go to Settings → Security → Change Password. You'll need your current password to set a new one." },
      { q: "Can I delete my account?", a: "Go to Settings → Data & Account → Delete Account Permanently. This action is irreversible and removes all your data." },
    ],
  },
  {
    label: "Contact Us",
    icon: MessageCircle,
    items: [
      { q: "How can I reach support?", a: "Email us at codewarriorabhi@gmail.com or call +91 96909 60990. We're available Mon–Sat, 10 AM – 6 PM IST." },
      { q: "I found a bug. How do I report it?", a: "Send a detailed description (with screenshots if possible) to codewarriorabhi@gmail.com and we'll look into it." },
      { q: "Where is Vyapaaro based?", a: "We're based in Nyamu, Muzaffarnagar, India." },
    ],
  },
];

const HelpSupportPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const query = search.toLowerCase().trim();

  const filtered = query
    ? faqData
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (i) =>
              i.q.toLowerCase().includes(query) ||
              i.a.toLowerCase().includes(query)
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : faqData;

  return (
    <div className="pb-24 md:pb-8 max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background pt-4 pb-3 border-b border-border -mx-4 px-4 md:static md:border-0 md:pt-8">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Help & Support</h1>
            <p className="text-xs text-muted-foreground">Find answers to common questions</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-6 space-y-6">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No results found for "{search}"</p>
        )}

        {filtered.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold">{cat.label}</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-1">
                {cat.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${cat.label}-${idx}`}
                    className="border border-border rounded-xl px-4 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-3">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-3">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HelpSupportPage;
