import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Farm {
  id: string;
  name: string;
  location: string;
  cropType: string;
  size: string;
  health: "good" | "warning" | "critical";
  yieldPrediction: number;
  harvestDate: string;
  confidence: number;
}

interface FarmRow {
  id: string;
  farm_name: string;
  location: string;
  crop_type: string;
  farm_size: string;
  created_at: string;
}

function rowToFarm(row: FarmRow): Farm {
  // Deterministic-ish derived metrics so cards look populated
  const seed = row.id.charCodeAt(0) + row.id.charCodeAt(1);
  const healths: Farm["health"][] = ["good", "warning", "critical"];
  return {
    id: row.id,
    name: row.farm_name,
    location: row.location,
    cropType: row.crop_type,
    size: row.farm_size,
    health: healths[seed % 3],
    yieldPrediction: 2000 + (seed * 37) % 3000,
    harvestDate: "2026-08-15",
    confidence: 70 + (seed % 25),
  };
}

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFarms = async () => {
    const { data, error } = await supabase
      .from("farms" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load farms", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setFarms(((data as unknown as FarmRow[]) ?? []).map(rowToFarm));
    setLoading(false);
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const addFarm = async (farm: { name: string; location: string; cropType: string; size: string }) => {
    const { error } = await supabase
      .from("farms" as any)
      .insert({
        farm_name: farm.name,
        location: farm.location,
        crop_type: farm.cropType,
        farm_size: farm.size,
        user_id: null,
      });
    if (error) {
      toast({ title: "Failed to add farm", description: error.message, variant: "destructive" });
      return;
    }
    await fetchFarms();
    toast({ title: "Farm added", description: `${farm.name} saved successfully.` });
  };

  return { farms, addFarm, loading };
}
