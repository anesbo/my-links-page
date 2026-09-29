import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anes Bouziad | Links & Portfolio",
    short_name: "Anes Bouziad",
    description: "Official bio and links page for Anes Bouziad",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d1a",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
