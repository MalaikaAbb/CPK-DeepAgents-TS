"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "state_rendering_agent";

//#region searches-panel
/**
 * The page's `YourMainContent`, styled.
 *
 * `agent.state` is reactive: the agent pushes each `copilotkitEmitState` call
 * over AG-UI as a state delta, this re-renders, and the ⏳ flips to ✅ a second
 * at a time. Nothing here polls or subscribes explicitly.
 */
function SearchesPanel() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
  });

  const searches =
    (agent.state.searches as { query: string; done: boolean }[]) ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Research progress
      </h1>
      <p className="mt-1 text-xs text-slate-500">
        Streamed from <code>agent.state.searches</code>. ⏳ flips to ✅ as the
        agent marks each task done.
      </p>

      {searches.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          Empty. Ask the agent to research something.
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {searches.map((search, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {search.done ? "✅" : "⏳"} {search.query}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
//#endregion

export default function Page() {
  return (
    <DemoFrame
      parentPath="/generative-ui/state-rendering"
      subtitle={`graph: ${AGENT_ID}`}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <SearchesPanel />
        <div className="min-h-0 border-t border-slate-200 md:border-l md:border-t-0 dark:border-slate-800">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}
