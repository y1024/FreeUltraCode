import { useEffect } from 'react';
import BlueprintCanvas from '@/canvas/BlueprintCanvas';
import Sidebar from '@/panels/Sidebar';
import PromptPanel from '@/panels/PromptPanel';
import AIDock from '@/panels/AIDock';
import { primeCliRuntime } from '@/lib/cliConfig';
import { useStore } from '@/store/useStore';

/**
 * Top-level three-zone layout:
 *   left  : Sidebar
 *   center: BlueprintCanvas (top) + AIDock (bottom)
 *   right : PromptPanel
 *
 * Simple workflows (meta.simple) replace the center column with a full-height
 * chat surface (AIDock layout="chat") — no blueprint canvas — but keep the
 * Sidebar and the right-hand PromptPanel (常用提示词).
 *
 * App.tsx is the consumer of all import contracts.
 */
export default function App() {
  const initHistory = useStore((s) => s.initHistory);
  const simpleMode = useStore((s) => s.workflow.meta?.simple === true);

  useEffect(() => {
    initHistory();
    void primeCliRuntime();
  }, [initHistory]);

  if (simpleMode) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-bg text-fg">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AIDock layout="chat" />
        </main>
        <div className="hidden md:block">
          <PromptPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-fg">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="min-h-0 min-w-0 flex-1">
          <BlueprintCanvas />
        </div>
        <AIDock />
      </main>
      <div className="hidden md:block">
        <PromptPanel />
      </div>
    </div>
  );
}
