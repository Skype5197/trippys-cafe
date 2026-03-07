import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Priya Sharma",
    rating: 5,
    text: "The rooftop view is absolutely stunning! Perfect place for a date night. The mojitos are amazing and the staff is super friendly.",
    avatar: "PS",
  },
  {
    name: "Rahul Jain",
    rating: 5,
    text: "Best cafe in Bhilwara hands down! The jungle theme is so unique and the food is delicious. Love hanging out here with friends.",
    avatar: "RJ",
  },
  {
    name: "Anjali Mehra",
    rating: 5,
    text: "The ambience is magical, especially in the evening with all the fairy lights. Their pasta and coffee are must-tries!",
    avatar: "AM",
  },
  {
    name: "Vikram Singh",
    rating: 4,
    text: "Great vibes and awesome music! The Trippy special combo is worth every rupee. Will definitely visit again.",
    avatar: "VS",
  },
  {
    name: "Neha Gupta",
    rating: 5,
    text: "Finally a place in Bhilwara where you can actually relax and enjoy quality food. The sunset view is breathtaking!",
    avatar: "NG",
  },
  {
    name: "Arjun Patel",
    rating: 5,
    text: "The live music on weekends makes it even better. Perfect escape from the daily hustle. Highly recommend!",
    avatar: "AP",
  },
];

export function ReviewsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 40, rotate: -1 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: { 
        duration: 1.3, 
        ease: [0.34, 1.56, 0.64, 1] // Bouncy/Elastic feel
      },
    },
  };

  return (
    <section className="section-padding bg-[hsl(var(--jungle-deep))] overflow-hidden">
      <div className="container-custom">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don&apos;t just take our word for it — hear from the people who&apos;ve experienced 
            the trippy vibes firsthand.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.name}
              className="glass-card-hover p-6 relative"
              variants={itemVariants}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-primary fill-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                &quot;{review.text}&quot;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {review.avatar}
                  </span>
                </div>
                <span className="font-medium text-foreground">{review.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ReviewsSection;
