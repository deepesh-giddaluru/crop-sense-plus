import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const location = url.searchParams.get("location");
    if (!location || location.trim().length === 0) {
      return new Response(JSON.stringify({ error: "location query param required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENWEATHER_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Geocode
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
    );
    const geoData = await geoRes.json();
    if (!Array.isArray(geoData) || geoData.length === 0) {
      return new Response(JSON.stringify({ error: "location not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { lat, lon, name, country } = geoData[0];

    // Current weather + 5 day forecast (free tier)
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
    ]);
    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // Pick one forecast entry per day (around 12:00)
    const daily = (forecast.list ?? [])
      .filter((entry: { dt_txt: string }) => entry.dt_txt?.includes("12:00:00"))
      .slice(0, 5)
      .map((entry: { dt: number; main: { temp: number }; weather: { main: string; icon: string }[] }) => ({
        dt: entry.dt,
        temp: Math.round(entry.main.temp),
        condition: entry.weather[0]?.main ?? "—",
        icon: entry.weather[0]?.icon ?? "01d",
      }));

    return new Response(
      JSON.stringify({
        location: { name, country, lat, lon },
        current: {
          temp: Math.round(current.main?.temp ?? 0),
          feels_like: Math.round(current.main?.feels_like ?? 0),
          humidity: current.main?.humidity ?? 0,
          wind: Math.round(current.wind?.speed ?? 0),
          condition: current.weather?.[0]?.main ?? "—",
          description: current.weather?.[0]?.description ?? "—",
          icon: current.weather?.[0]?.icon ?? "01d",
        },
        forecast: daily,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
