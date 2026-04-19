import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Deterministic mock NDVI keyed by location string.
// Swap implementation later for Sentinel Hub or Earth Engine.
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const location = url.searchParams.get("location") ?? "default";
  const seed = hash(location.toLowerCase().trim());

  // NDVI between 0.20 and 0.90
  const ndvi = +(0.2 + seed * 0.7).toFixed(2);
  const status = ndvi >= 0.65 ? "good" : ndvi >= 0.45 ? "warning" : "critical";
  const label =
    status === "good" ? "Vigorous growth" : status === "warning" ? "Moderate stress" : "Severe stress";

  // 6-week trend (simulated)
  const trend = Array.from({ length: 6 }, (_, i) => {
    const noise = (hash(`${location}-${i}`) - 0.5) * 0.12;
    return +Math.max(0.1, Math.min(0.95, ndvi + noise)).toFixed(2);
  });

  return new Response(
    JSON.stringify({
      location,
      ndvi,
      status,
      label,
      trend,
      capturedAt: new Date().toISOString(),
      source: "simulated",
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
