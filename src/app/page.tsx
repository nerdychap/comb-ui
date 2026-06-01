import GeneratorView from "@/components/generator-view";
import { StreamProvider } from "@/providers/stream-provider";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StreamProvider>
        <GeneratorView />
      </StreamProvider>
    </div>
  );
}
