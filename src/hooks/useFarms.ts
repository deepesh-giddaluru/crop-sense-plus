import { useState } from "react";

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

const initialFarms: Farm[] = [
  {
    id: "1",
    name: "Sunrise Rice Paddy",
    location: "Bali, Indonesia",
    cropType: "Rice",
    size: "2.5 ha",
    health: "good",
    yieldPrediction: 4200,
    harvestDate: "2026-07-15",
    confidence: 89,
  },
  {
    id: "2",
    name: "Green Valley Corn",
    location: "Cebu, Philippines",
    cropType: "Corn",
    size: "1.8 ha",
    health: "warning",
    yieldPrediction: 3100,
    harvestDate: "2026-06-20",
    confidence: 74,
  },
  {
    id: "3",
    name: "Highland Vegetables",
    location: "Chiang Mai, Thailand",
    cropType: "Mixed Vegetables",
    size: "0.9 ha",
    health: "critical",
    yieldPrediction: 1800,
    harvestDate: "2026-05-30",
    confidence: 62,
  },
];

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>(initialFarms);

  const addFarm = (farm: Omit<Farm, "id" | "health" | "yieldPrediction" | "harvestDate" | "confidence">) => {
    const newFarm: Farm = {
      ...farm,
      id: Date.now().toString(),
      health: "good",
      yieldPrediction: Math.floor(Math.random() * 3000) + 2000,
      harvestDate: "2026-08-15",
      confidence: Math.floor(Math.random() * 20) + 70,
    };
    setFarms((prev) => [...prev, newFarm]);
  };

  return { farms, addFarm };
}
