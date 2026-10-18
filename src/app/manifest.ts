import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PromptAtWork — Niharika Dhande",
    short_name: "PromptAtWork",
    description:
      "A living portfolio of practical AI engineering — built, documented and taught in the open.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      { src: "/images/brand/promptatwork-mark.png", sizes: "256x256", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
