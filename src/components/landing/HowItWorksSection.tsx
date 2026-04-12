import { motion } from "framer-motion";

const steps = [
  { step: "01", title: "Add Your Farm", description: "Enter your farm location, crop type, and size. Our system starts analyzing satellite data immediately." },
  { step: "02", title: "Get AI Insights", description: "Receive yield predictions, health assessments, and market timing recommendations powered by machine learning." },
  { step: "03", title: "Harvest & Profit", description: "Use data-driven insights to optimize harvest timing and connect with buyers at the best market price." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">How it works</h2>
          <p className="mt-4 text-muted-foreground">Three simple steps to smarter farming.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-xl font-bold">
                {s.step}
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-3 text-muted-foreground max-w-xs mx-auto">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
