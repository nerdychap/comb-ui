import GeneratorView from "@/components/generator-view";
import { StreamProvider } from "@/providers/stream-provider";

export default function Home() {
  return (
    <StreamProvider>
      <GeneratorView />
    </StreamProvider>
  );
}
