import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const GalleryPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<{ src: string; alt: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      const supabaseImages = (data || []).map(img => ({
        src: img.image_url,
        alt: img.title || "Gallery image",
        category: "Cafe"
      }));

      setImages(supabaseImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16 jungle-pattern">
        <div className="container-custom text-center">
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
            Visual Journey
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            The Trippy <span className="gradient-text">Vibes</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a peek into our jungle paradise. From stunning rooftop views to 
            cozy corners and delicious food — experience Trippy's Cafe through our lens.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="break-inside-avoid overflow-hidden rounded-2xl group cursor-pointer relative"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {image.category}
                      </span>
                      <p className="text-foreground font-medium">{image.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-card/60 flex items-center justify-center text-foreground hover:bg-card transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </button>

          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/60 flex items-center justify-center text-foreground hover:bg-card transition-colors text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ←
          </button>

          <div className="max-w-5xl max-h-[80vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImage].src}
              alt={images[currentImage].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <p className="text-center text-muted-foreground mt-4">
              {images[currentImage].alt}
            </p>
          </div>

          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/60 flex items-center justify-center text-foreground hover:bg-card transition-colors text-2xl"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            →
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
