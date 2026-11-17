const config = {
  projectId: "nailroom-booking",
  dataset: "production",
  targetUrl: process.env.NEXT_PUBLIC_TARGET_URL || "http://localhost:8282",
  apiMode: process.env.NEXT_PUBLIC_API_MODE === "real" ? "real" : "mock",
};

export default config;
