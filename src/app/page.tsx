"use client";

import { useConfig } from "@/lib/config-context";
import BioPreview from "@/components/preview/BioPreview";

export default function HomePage() {
  const { config } = useConfig();

  return (
    <div className="min-h-screen">
      <BioPreview config={config} interactive />
    </div>
  );
}
