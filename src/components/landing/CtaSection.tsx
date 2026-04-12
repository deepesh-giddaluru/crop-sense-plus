import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-primary p-12 text-center md:p-20">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to transform your farming?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Join thousands of Southeast Asian farmers using AI to increase yields and reduce waste.
          </p>
          <Link to="/auth" className="inline-block mt-8">
            <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
