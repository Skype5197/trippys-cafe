import { Link } from "react-router-dom";
import { MapPin, Clock, Music } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a gentle feel
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/379a46bf-9121-4d58-91f0-61c1b2d5a2e4/bg-1767968710699.jpg?width=8000&height=8000&resize=contain" 
                alt="Trippy's Cafe rooftop view" 
                className="w-full h-full object-cover brightness-95" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />
              <div className="absolute inset-0 jungle-pattern opacity-10" />
            </div>

        <motion.div 
          className="container-custom relative z-10 pt-24 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="flex justify-center mb-8" variants={itemVariants}>
              <div className="h-28 w-28 logo-container border-2 border-primary/30 shadow-glow">
                <img 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/379a46bf-9121-4d58-91f0-61c1b2d5a2e4/554414338_17843181288585291_8002408894363735560_n-1767508148340.jpg?width=8000&height=8000&resize=contain" 
                  alt="Trippy's Cafe Logo" 
                  className="logo-img scale-110"
                />
              </div>
            </motion.div>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              variants={itemVariants}
            >
              <Music className="w-4 h-4 text-primary animate-glow-pulse" />
              <span className="text-sm text-primary font-medium">
                Live Music & Scenic Views
              </span>
            </motion.div>

          <motion.h1 
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6" 
            variants={itemVariants}
          >
            Not just food, we serve you the{" "}
            <span className="gradient-text">essence of the jungle</span>{" "}
            with peaceful vibes
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10" 
            variants={itemVariants}
          >
            A view you&apos;ve never seen before. Experience the perfect blend of nature, 
            comfort, and culinary excellence at Bhilwara&apos;s most unique rooftop cafe.
          </motion.p>

          <motion.div 
            className="flex justify-center mb-16" 
            variants={itemVariants}
          >
            <Link to="/menu" className="btn-hero">
              View Menu
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto" 
            variants={itemVariants}
          >
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">Bhilwara, Rajasthan</p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Open Daily</p>
                <p className="text-sm font-medium text-foreground">1 PM - 10 PM</p>
              </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Every Weekend</p>
                <p className="text-sm font-medium text-foreground">Live Music</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-glow-pulse" />
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
