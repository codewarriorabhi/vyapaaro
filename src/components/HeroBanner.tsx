import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Festive Season Sale",
    subtitle: "Up to 60% off on ethnic wear",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=900&h=400&fit=crop",
    gradient: "from-primary/90 to-primary/40",
  },
  {
    id: 2,
    title: "Electronics Mega Deals",
    subtitle: "Latest gadgets at unbeatable prices",
    cta: "Explore",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=900&h=400&fit=crop",
    gradient: "from-accent/90 to-accent/40",
  },
  {
    id: 3,
    title: "Fresh Groceries Daily",
    subtitle: "Farm-fresh produce at your doorstep",
    cta: "Order Now",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&h=400&fit=crop",
    gradient: "from-primary/90 to-primary/40",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + banners.length) % banners.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl aspect-[2.2/1] md:aspect-[3/1]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${banners[current].gradient}`} />
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
            <h2 className="text-xl md:text-3xl font-extrabold text-primary-foreground drop-shadow-md">
              {banners[current].title}
            </h2>
            <p className="text-sm md:text-base text-primary-foreground/90 mt-1">
              {banners[current].subtitle}
            </p>
            <button className="mt-3 w-fit px-5 py-2 bg-card text-foreground text-sm font-bold rounded-full shadow-card hover:shadow-card-hover transition-shadow">
              {banners[current].cta}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-card/90 transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/60 backdrop-blur flex items-center justify-center text-foreground hover:bg-card/90 transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-primary-foreground" : "w-1.5 bg-primary-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
