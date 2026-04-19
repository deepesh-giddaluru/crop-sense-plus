import { useEffect, useState } from "react";
import { BarChart3, Leaf, Bell, TrendingUp, MapPin, Calendar, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import AddFarmDialog from "@/components/dashboard/AddFarmDialog";
import { useFarms, type Farm } from "@/hooks/useFarms";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const healthColors = {
  good: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  critical: "bg-destructive text-destructive-foreground",
};

const healthLabels = { good: "Healthy", warning: "At Risk", critical: "Critical" };

const alerts = [
  { id: 1, type: "warning" as const, message: "Heavy rainfall expected in Cebu region — consider early harvest for corn crops.", time: "2 hours ago" },
  { id: 2, type: "good" as const, message: "Rice prices trending up 12% this week — optimal selling window detected.", time: "5 hours ago" },
  { id: 3, type: "critical" as const, message: "Pest risk detected in Highland Vegetables farm — immediate action recommended.", time: "1 day ago" },
];

const alertStyles = {
  good: "border-l-4 border-l-success bg-success/10",
  warning: "border-l-4 border-l-warning bg-warning/10",
  critical: "border-l-4 border-l-destructive bg-destructive/10",
};

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof BarChart3; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="mt-4 font-heading text-3xl font-bold text-card-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function FarmCard({ farm }: { farm: Farm }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading font-semibold text-card-foreground">{farm.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {farm.location}
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${healthColors[farm.health]}`}>
          {healthLabels[farm.health]}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Crop</p>
          <p className="font-medium text-card-foreground">{farm.cropType}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Yield</p>
          <p className="font-medium text-card-foreground">{farm.yieldPrediction} kg</p>
        </div>
        <div>
          <p className="text-muted-foreground">Confidence</p>
          <p className="font-medium text-card-foreground">{farm.confidence}%</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" />
        Est. harvest: {new Date(farm.harvestDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
      {/* Simple NDVI bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>NDVI Health Index</span>
          <span>{farm.health === "good" ? "0.82" : farm.health === "warning" ? "0.54" : "0.31"}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${farm.health === "good" ? "bg-success w-4/5" : farm.health === "warning" ? "bg-warning w-1/2" : "bg-destructive w-1/3"}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { farms, addFarm } = useFarms();
  const [users, setUsers] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setUsers(data ?? []));
  }, []);

  const totalYield = farms.reduce((s, f) => s + f.yieldPrediction, 0);
  const avgConfidence = Math.round(farms.reduce((s, f) => s + f.confidence, 0) / farms.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your farms and predictions.</p>
            </div>
            <AddFarmDialog onAdd={addFarm} />
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard icon={BarChart3} label="Total Predicted Yield" value={`${(totalYield / 1000).toFixed(1)}t`} sub={`Across ${farms.length} farms`} />
            <StatCard icon={TrendingUp} label="Avg. Confidence" value={`${avgConfidence}%`} sub="AI prediction accuracy" />
            <StatCard icon={Leaf} label="Farms Monitored" value={`${farms.length}`} sub={`${farms.filter((f) => f.health === "good").length} healthy`} />
            <StatCard icon={Bell} label="Active Alerts" value={`${alerts.length}`} sub="1 critical, 1 warning" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Farms */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Your Farms</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {farms.map((farm) => (
                  <FarmCard key={farm.id} farm={farm} />
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Smart Alerts</h2>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`rounded-lg p-4 ${alertStyles[alert.type]}`}>
                    <p className="text-sm text-card-foreground">{alert.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
