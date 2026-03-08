import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 md:pb-8 max-w-2xl mx-auto px-4">
      <div className="sticky top-0 z-30 bg-background border-b border-border py-3 flex items-center gap-3 -mx-4 px-4 md:static md:border-0 md:pt-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Last updated: March 8, 2026</p>
        </div>
      </div>

      <div className="mt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using Vyapaaro ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Description of Service</h2>
          <p>Vyapaaro is a local shop discovery and listing platform that connects customers with nearby businesses. Shop owners can create listings, manage products, and interact with customers. Users can browse shops, leave reviews, and place orders.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. User Accounts</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You must be at least 18 years old to create a shop owner account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Shop Listings</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Shop owners are responsible for the accuracy of their listings.</li>
            <li>Listings must not contain misleading, fraudulent, or illegal content.</li>
            <li>We reserve the right to remove listings that violate our guidelines.</li>
            <li>Product images must be genuine and represent the actual goods or services offered.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Reviews & Ratings</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reviews must be honest, relevant, and based on genuine experiences.</li>
            <li>Fake reviews, spam, or defamatory content is strictly prohibited.</li>
            <li>Shop owners may reply to reviews but may not manipulate ratings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>Use the Platform for any unlawful purpose.</li>
            <li>Harass, abuse, or threaten other users.</li>
            <li>Attempt to gain unauthorized access to accounts or systems.</li>
            <li>Scrape, crawl, or use automated tools to collect data from the Platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>Vyapaaro is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to transactions between users and shop owners.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:codewarriorabhi@gmail.com" className="text-primary underline">codewarriorabhi@gmail.com</a> or call <a href="tel:+919690960990" className="text-primary underline">+91 96909 60990</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
