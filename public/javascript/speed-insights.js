import { SpeedInsights } from "@vercel/speed-insights";

// Initialize Speed Insights for client-side performance tracking
const insights = new SpeedInsights({
  projectId: "prj_nn87nwc9CuNtT5kaPGXM9ccGUYkN",
  apiKey: "uhQX7Fda90DnppfOTuYdq6NM"
});

// Call this to collect data on page load
insights.collect();
