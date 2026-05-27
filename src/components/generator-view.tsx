import { StreamProvider } from "@/providers/stream-provider";
import GeneratorViewInner from "@/components/generator-view-inner";

export default function GeneratorView() {
  return (
    <StreamProvider>
      <GeneratorViewInner />
    </StreamProvider>
  );
}