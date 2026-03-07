import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-[hsl(var(--jungle-dark))] border-t border-border/20">
      <motion.div 
        className="container-custom py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="h-14 w-14 logo-container">
                  <img 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/379a46bf-9121-4d58-91f0-61c1b2d5a2e4/554414338_17843181288585291_8002408894363735560_n-1767508148340.jpg?width=8000&height=8000&resize=contain" 
                    alt="Trippy's Cafe Logo" 
                    className="logo-img"
                  />
                </div>
                <span className="font-serif text-xl font-bold text-foreground">
                  Trippy&apos;s
                </span>
              </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A jungle-themed rooftop cafe with peaceful vibes, scenic views, and the best food in Bhilwara.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/tri_ppyscafe" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card/40 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/917568963063" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-card/40 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { name: "Home", href: "/" },
                { name: "Menu", href: "/menu" },
                { name: "Gallery", href: "/gallery" },
              ].map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>R.S. Tower, Azad Nagar, Bhilwara, Rajasthan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+91 75689 63063</span>
              </div>
              <a 
                href="https://instagram.com/tri_ppyscafe" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4 text-primary flex-shrink-0" />
                <span>@tri_ppyscafe</span>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-foreground">Opening Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span>1:00 PM - 10:00 PM</span>
              </div>
              <p className="text-sm text-muted-foreground">Open Daily</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Trippy&apos;s Cafe. All rights reserved.
          </p>
            <p className="text-sm text-muted-foreground">
              Made with <Link to="/admin" className="hover:cursor-default">🌿</Link> in Bhilwara
            </p>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
