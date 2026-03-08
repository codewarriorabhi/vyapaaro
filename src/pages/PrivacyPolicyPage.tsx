import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-24 md:pb-8 max-w-2xl mx-auto px-4">
      <div className="sticky top-0 z-30 bg-background border-b border-border py-3 flex items-center gap-3 -mx-4 px-4 md:static md:border-0 md:pt-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: March 8, 2026</p>
        </div>
      </div>

      <div className="mt-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li><strong>Account data:</strong> Name, email, phone number, and address when you sign up.</li>
            <li><strong>Profile data:</strong> Avatar, bio, and preferences you choose to share.</li>
            <li><strong>Shop data:</strong> Business name, description, photos, products, and contact info for shop owners.</li>
            <li><strong>Usage data:</strong> Reviews, ratings, saved items, and order history.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide, maintain, and improve the Platform.</li>
            <li>To personalize your experience and show relevant shops nearby.</li>
            <li>To process orders and facilitate communication between users and shops.</li>
            <li>To send notifications about orders, reviews, and promotions (with your consent).</li>
            <li>To detect and prevent fraud, abuse, and security threats.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Location Data</h2>
          <p>With your permission, we collect location data to show nearby shops and provide location-based features. You can disable location access at any time in Settings → Location.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Data Sharing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do <strong>not</strong> sell your personal data to third parties.</li>
            <li>Your public profile info (name, avatar) is visible to other users when you leave reviews.</li>
            <li>Shop owner contact details are visible on their public shop pages.</li>
            <li>We may share data with service providers who help us operate the Platform (e.g., hosting, email delivery).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Data Security</h2>
          <p>We use industry-standard encryption and security measures to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>Access and download your personal data.</li>
            <li>Correct inaccurate information in your profile.</li>
            <li>Delete your account and associated data.</li>
            <li>Opt out of marketing communications.</li>
            <li>Control your privacy settings (profile visibility, contact preferences).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Cookies & Analytics</h2>
          <p>We use essential cookies to keep you logged in and remember your preferences. We may use analytics to understand how the Platform is used and to improve our services.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Children's Privacy</h2>
          <p>Vyapaaro is not intended for children under 13. We do not knowingly collect personal data from children.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">10. Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:codewarriorabhi@gmail.com" className="text-primary underline">codewarriorabhi@gmail.com</a> or call <a href="tel:+919690960990" className="text-primary underline">+91 96909 60990</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
