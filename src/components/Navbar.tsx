import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Menu", href: "/menu" },
  { name: "Gallery", href: "/gallery" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const element = document.getElementById(href.slice(2));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between px-6 py-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-500 shadow-xl ${
          scrolled 
            ? "bg-background/40 w-[95%] max-w-4xl" 
            : "bg-background/20 w-full max-w-6xl"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/379a46bf-9121-4d58-91f0-61c1b2d5a2e4/554414338_17843181288585291_8002408894363735560_n-1767508148340.jpg?width=8000&height=8000&resize=contain" 
              alt="Trippy's Cafe Logo" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="font-serif text-xl font-bold text-foreground hidden sm:block tracking-tight">
            Trippy&apos;s
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group/link"
            >
              {link.name}
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full" />
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-foreground p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-[calc(100%+1rem)] left-4 right-4 bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2 px-4 hover:bg-white/5 rounded-xl"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

export default Navbar;
