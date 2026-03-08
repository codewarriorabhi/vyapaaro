import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-12 pb-20 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Vyapaaro" className="h-10 w-10 rounded-lg object-contain" />
              <span className="font-extrabold text-lg text-foreground">Vyapaaro</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover &amp; support local shops near you. Your neighbourhood marketplace, now digital.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Browse Shops", to: "/shops" },
                { label: "Saved Items", to: "/saved" },
                { label: "My Profile", to: "/profile" },
                { label: "Sign Up", to: "/signup" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Shop Owners */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">For Shop Owners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">List Your Shop</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Seller Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Nyamu, Muzaffarnagar, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+919690960990" className="hover:text-primary transition-colors">+91 96909 60990</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:codewarriorabhi@gmail.com" className="hover:text-primary transition-colors">codewarriorabhi@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Vyapaaro. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/help-support" className="hover:text-primary transition-colors">Help & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
