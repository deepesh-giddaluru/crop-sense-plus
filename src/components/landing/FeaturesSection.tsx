import { BarChart3, Leaf, Bell } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BarChart3,
    title: "Yield Prediction",
    description: "Get accurate crop yield estimates powered by satellite data and machine learning. Know your harvest potential weeks in advance.",
  },
  {
    icon: Leaf,
    title: "Crop Health Monitoring",
    description: "Real-time NDVI-based health analysis with color-coded indicators. Catch problems early before they spread.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Receive timely notifications about crop risks, weather hazards, and optimal market timing to maximize your profit.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to farm smarter
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed specifically for Southeast Asian agriculture.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-semibold text-card-foreground">{f.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
