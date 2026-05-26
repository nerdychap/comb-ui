"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GeneratorView from "@/components/generator-view";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneratorView />
    </QueryClientProvider>
  );
}
