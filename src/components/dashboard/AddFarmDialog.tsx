import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (farm: { name: string; location: string; cropType: string; size: string }) => void;
}

export default function AddFarmDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", cropType: "", size: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: "", location: "", cropType: "", size: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Farm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">Add New Farm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="farmName">Farm Name</Label>
            <Input id="farmName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="farmLocation">Location</Label>
            <Input id="farmLocation" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bali, Indonesia" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cropType">Crop Type</Label>
            <Input id="cropType" value={form.cropType} onChange={(e) => setForm({ ...form, cropType: e.target.value })} placeholder="e.g. Rice, Corn" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size</Label>
            <Input id="farmSize" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 2.5 ha" required />
          </div>
          <Button type="submit" className="w-full">Add Farm</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
