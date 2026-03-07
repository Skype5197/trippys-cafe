import { Leaf, Heart, Users, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    title: "Jungle Vibes",
    description: "Surrounded by lush greenery and nature-inspired decor",
  },
  {
    icon: Heart,
    title: "Cozy Hangouts",
    description: "Perfect spot for dates, friends, and family gatherings",
  },
  {
    icon: Users,
    title: "All Welcome",
    description: "Students, couples, families - everyone finds their vibe here",
  },
  {
    icon: Sparkles,
    title: "Trippy Aesthetics",
    description: "Unique lighting and decor that creates a magical atmosphere",
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function bellCurve(t: number) {
  return Math.exp(-4 * t * t);
}

function ImageCarousel({ images }: { images: { src: string; alt: string; className: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const scrollXRef = useRef(0);
  const speedRef = useRef(0.6); // px per frame

  // Duplicate images for seamless loop
  const loopedImages = [...images, ...images, ...images];

  const CARD_W_VW = 28; // vw for card width (lg)
  const GAP_PX = 16;

  const applyStyles = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const viewportCenterX = window.innerWidth / 2;
    const cards = cardRefs.current;

    // Estimate card width in px (first card as reference)
    const firstCard = cards.find(Boolean);
    const cardWidthPx = firstCard ? firstCard.offsetWidth : (window.innerWidth * CARD_W_VW) / 100;
    const influenceRadius = cardWidthPx + GAP_PX;

    cards.forEach((card) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distPx = cardCenterX - viewportCenterX;
      const normalised = distPx / influenceRadius;
      const influence = bellCurve(normalised);

      const scale = lerp(0.88, 1.18, influence);
      const brightness = lerp(0.68, 1.0, influence);
      const saturate = lerp(0.60, 1.12, influence);

      card.style.transform = `scale(${scale})`;
      card.style.filter = `brightness(${brightness}) saturate(${saturate})`;
      card.style.zIndex = influence > 0.5 ? "2" : "1";
    });
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    // Get the width of a single set of images (1/3 of total track)
    const getSetWidth = () => {
      const firstCard = cardRefs.current.find(Boolean);
      if (!firstCard) return 0;
      const cardW = firstCard.offsetWidth;
      return images.length * (cardW + GAP_PX);
    };

    let animFrameId: number;

    const tick = () => {
      scrollXRef.current += speedRef.current;
      const setWidth = getSetWidth();

      // Reset to start of second set for seamless loop
      if (setWidth > 0 && scrollXRef.current >= setWidth) {
        scrollXRef.current -= setWidth;
      }

      if (track) {
        track.style.transform = `translateX(-${scrollXRef.current}px)`;
      }

      applyStyles();
      animFrameId = requestAnimationFrame(tick);
    };

    // Start from second set to allow seamless left/right wrapping
    const initSetWidth = () => {
      const setWidth = getSetWidth();
      if (setWidth > 0) {
        scrollXRef.current = setWidth; // start at second copy
      }
    };

    // Wait one frame for cards to mount and measure
    animFrameId = requestAnimationFrame(() => {
      initSetWidth();
      animFrameId = requestAnimationFrame(tick);
    });

    rafRef.current = animFrameId;

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [images, applyStyles]);

  if (images.length === 0) return null;

  return (
    <div className="mb-16 overflow-hidden relative h-[260px] sm:h-[320px] md:h-[380px]">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <div className="w-full h-full flex items-center">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{ gap: `${GAP_PX}px`, paddingLeft: `${GAP_PX}px` }}
        >
          {loopedImages.map((img, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="flex-shrink-0 w-[55vw] sm:w-[40vw] md:w-[30vw] lg:w-[24vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
              style={{ willChange: "transform, filter" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutSection() {
    const [images, setImages] = useState<{ src: string; alt: string; className: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("display_order", { ascending: true })
          .limit(4);

        if (error) throw error;

        if (data && data.length > 0) {
          const layouts = [
            "col-span-2 row-span-2",
            "",
            "",
            "col-span-2",
          ];
          
          const mappedImages = data.map((img, index) => ({
            src: img.image_url,
            alt: img.title || "Gallery image",
            className: layouts[index] || "",
          }));
          setImages(mappedImages);
        }
      } catch (error) {
        console.error("Error fetching about section images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 1.5, 
        ease: [0.16, 1, 0.3, 1] 
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 1.8, 
        ease: [0.16, 1, 0.3, 1] 
      },
    },
  };

  return (
    <section id="about" className="section-padding jungle-pattern overflow-hidden">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.span 
            className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block"
            variants={itemVariants}
          >
            Our Story
          </motion.span>
          <motion.h2 
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Where the Jungle Meets the Sky
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg leading-relaxed"
            variants={itemVariants}
          >
            Trippy&apos;s Cafe is more than just a cafe — it&apos;s an escape. Nestled on a rooftop in 
            Bhilwara, we&apos;ve created a jungle paradise where you can unwind with great food, 
            soothing music, and views that take your breath away.
          </motion.p>
        </motion.div>

        {loading ? (
            <div className="flex items-center justify-center py-10 mb-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : images.length > 0 ? (
            <ImageCarousel images={images} />
          ) : null}

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="glass-card-hover p-6 text-center"
              variants={itemVariants}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
