import { useEffect, useState } from "react";
import { Cloud, Droplets, Wind, Satellite, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface FarmInsightsProps {
  farmName: string;
  location: string;
}

interface Weather {
  location: { name: string; country: string };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind: number;
    condition: string;
    description: string;
    icon: string;
  };
  forecast: { dt: number; temp: number; condition: string; icon: string }[];
}

interface Ndvi {
  ndvi: number;
  status: "good" | "warning" | "critical";
  label: string;
  trend: number[];
  capturedAt: string;
}

const statusColors = {
  good: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

export default function FarmInsightsDialog({ farmName, location }: FarmInsightsProps) {
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [ndvi, setNdvi] = useState<Ndvi | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);

    Promise.all([
      supabase.functions.invoke("get-weather", { body: { location } }),
      supabase.functions.invoke("get-ndvi", { body: { location } }),
    ])
      .then(([w, n]) => {
        if (w.error) throw new Error(w.error.message);
        if (n.error) throw new Error(n.error.message);
        setWeather(w.data);
        setNdvi(n.data);
      })
      .catch((e) => setError(e.message ?? "Failed to load insights"))
      .finally(() => setLoading(false));
  }, [open, location]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4">
          View Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">{farmName} — Insights</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Fetching satellite & weather...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && weather && ndvi && (
          <div className="space-y-5">
            {/* Weather */}
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="h-4 w-4 text-primary" />
                <h3 className="font-heading font-semibold text-sm">
                  Weather — {weather.location.name}, {weather.location.country}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                  alt={weather.current.description}
                  className="h-16 w-16"
                />
                <div>
                  <p className="font-heading text-3xl font-bold text-card-foreground">
                    {weather.current.temp}°C
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {weather.current.description}
                  </p>
                </div>
                <div className="ml-auto grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" /> {weather.current.humidity}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-3 w-3" /> {weather.current.wind} m/s
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {weather.forecast.map((d) => (
                  <div key={d.dt} className="rounded-md bg-secondary p-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      {new Date(d.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                      alt={d.condition}
                      className="mx-auto h-8 w-8"
                    />
                    <p className="text-xs font-medium text-card-foreground">{d.temp}°</p>
                  </div>
                ))}
              </div>
            </section>

            {/* NDVI */}
            <section className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Satellite className="h-4 w-4 text-primary" />
                <h3 className="font-heading font-semibold text-sm">Satellite NDVI</h3>
                <span className="ml-auto text-xs text-muted-foreground">simulated</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-heading text-3xl font-bold ${statusColors[ndvi.status]}`}>
                    {ndvi.ndvi}
                  </p>
                  <p className="text-sm text-muted-foreground">{ndvi.label}</p>
                </div>
                {/* Sparkline */}
                <div className="flex items-end gap-1 h-12">
                  {ndvi.trend.map((v, i) => (
                    <div
                      key={i}
                      className="w-3 rounded-sm bg-primary/70"
                      style={{ height: `${v * 100}%` }}
                      title={`Week ${i + 1}: ${v}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
