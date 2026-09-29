"use client";

import { useConfig } from "@/lib/config-context";
import BioPreview from "@/components/preview/BioPreview";

export default function HomePage() {
  const { config } = useConfig();

  return (
    <main className="min-h-screen min-h-[100dvh] w-full flex flex-col flex-1">
      <BioPreview config={config} interactive />
    </main>
  );
}
