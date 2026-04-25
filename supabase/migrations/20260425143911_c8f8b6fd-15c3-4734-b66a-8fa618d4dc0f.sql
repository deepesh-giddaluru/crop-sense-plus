CREATE TABLE public.farms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_name TEXT NOT NULL,
  location TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  farm_size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farms are viewable by everyone"
ON public.farms
FOR SELECT
USING (true);

CREATE POLICY "Anyone can add farms"
ON public.farms
FOR INSERT
WITH CHECK (true);