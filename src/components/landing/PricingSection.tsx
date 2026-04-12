import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["1 farm", "Basic yield prediction", "Weekly health reports", "Email alerts"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For serious farmers",
    features: ["Up to 10 farms", "Advanced AI predictions", "Daily health monitoring", "Smart selling alerts", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Premium",
    price: "$49",
    period: "/mo",
    description: "For cooperatives & aggregators",
    features: ["Unlimited farms", "Custom AI models", "Real-time monitoring", "Market intelligence", "API access", "Dedicated support"],
    cta: "Contact Sales",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-muted-foreground">Start free. Scale as you grow.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-xl border p-8 ${
                p.featured
                  ? "border-primary bg-card shadow-lg ring-1 ring-primary/20 scale-105"
                  : "border-border bg-card shadow-sm"
              }`}
            >
              {p.featured && (
                <span className="mb-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-heading text-xl font-bold text-card-foreground">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">{p.price}</span>
                {p.period && <span className="text-muted-foreground">{p.period}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-card-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block mt-8">
                <Button className="w-full" variant={p.featured ? "default" : "outline"}>
                  {p.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
