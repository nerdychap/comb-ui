"use client";

import GeneratorView from "@/components/generator-view";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneratorView />
    </QueryClientProvider>
  );
}
