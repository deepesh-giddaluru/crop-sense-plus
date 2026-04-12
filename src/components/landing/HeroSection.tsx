import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Aerial view of lush rice paddies" width={1920} height={1080} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="inline-block rounded-full border border-primary/30 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6">
            🌱 AI-Powered Agriculture
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Predict your harvest.{" "}
            <span className="text-primary">Sell smarter.</span>{" "}
            Waste less.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            AgriSight AI uses satellite and drone imagery to deliver real-time yield predictions, crop health monitoring, and smart selling alerts for Southeast Asian farmers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-base px-8">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                Learn More
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
