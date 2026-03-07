import { useState, useEffect } from "react";
import { LucideIcon, Coffee, Flame, UtensilsCrossed, Cookie, Sparkles, Loader2, Salad } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type MenuItem = Tables<"menu_items">;
type Category = Tables<"categories">;

const categoryConfig: Record<string, { name: string; icon: LucideIcon }> = {
  beverages: { name: "Beverages", icon: Coffee },
  starters: { name: "Starters", icon: Flame },
  "main-course": { name: "Main Course", icon: UtensilsCrossed },
  desserts: { name: "Desserts", icon: Cookie },
  combos: { name: "Trippy Combos", icon: Sparkles },
};

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch categories and items in parallel
    const [catsRes, itemsRes] = await Promise.all([
      supabase.from("categories").select("*").order("name", { ascending: true }),
      supabase.from("menu_items").select("*").eq("is_available", true).order("name", { ascending: true })
    ]);

    if (catsRes.data) {
      setCategories(catsRes.data);
    }

    if (itemsRes.data) {
      const grouped = itemsRes.data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, MenuItem[]>);
      
      setMenuItems(grouped);
      
      // Set active category to the first one that has items
      if (catsRes.data) {
        const firstWithItems = catsRes.data.find(cat => grouped[cat.slug] && grouped[cat.slug].length > 0);
        if (firstWithItems) {
          setActiveCategory(firstWithItems.slug);
        } else if (catsRes.data.length > 0) {
          setActiveCategory(catsRes.data[0].slug);
        }
      }
    }
    
    setLoading(false);
  };

  const displayCategories = categories.filter(
    (cat) => menuItems[cat.slug] && menuItems[cat.slug].length > 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 jungle-pattern">
        <div className="container-custom text-center">
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
            Explore Our
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Trippy <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From aromatic chai to gourmet meals, discover the flavors that make 
            Trippy&apos;s Cafe a culinary adventure in the jungle.
          </p>
        </div>
      </section>

      {!loading && displayCategories.length > 0 && (
        <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30 py-4">
          <div className="container-custom">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {displayCategories.map((cat) => {
                const config = categoryConfig[cat.slug] || { name: cat.name, icon: Salad };
                const Icon = config.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex items-center gap-2 whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-full transition-all duration-300 ${
                      activeCategory === cat.slug
                        ? "btn-hero"
                        : "btn-glass"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding min-h-[400px]">
        <div className="container-custom">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading our jungle flavors...</p>
            </div>
          ) : displayCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Our kitchen is being prepared. Please check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(menuItems[activeCategory] || []).map((item, index) => (
                <div
                  key={item.id}
                  className="glass-card-hover p-6 flex flex-col"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <span className="text-primary font-bold text-lg">
                      ₹{item.price}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground flex-grow">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
