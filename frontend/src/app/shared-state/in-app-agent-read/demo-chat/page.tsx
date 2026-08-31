"use client";

import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "shared_state_agent";

//#region read-state
/**
 * The page's `YourMainContent`, read-only.
 *
 * No subscription, no effect — `agent.state` is reactive, so this re-renders
 * whenever a state delta arrives over AG-UI.
 */
function YourMainContent() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
  });

  const language = (agent.state.language as string) ?? "Not Set";

  // `agent.state` carries the whole message history alongside the agent's own
  // fields. Printed raw it is thousands of lines of OpenAI response metadata,
  // which pushes `language` off screen and buries the one value this page is
  // about — so the transcript is dropped and only the state fields are shown.
  const { messages: _messages, ...stateFields } = agent.state as Record<
    string,
    unknown
  >;

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Your main content
      </h1>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        Language:{" "}
        <strong className="rounded bg-[var(--accent)]/10 px-1.5 py-0.5 text-[var(--accent)]">
          {language}
        </strong>
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Nothing here writes this value. Ask the chat to switch language and it
        changes as the agent&apos;s state delta arrives.
      </p>

      <pre className="mt-4 min-h-0 flex-1 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {JSON.stringify(stateFields, null, 2)}
      </pre>
    </div>
  );
}
//#endregion

export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-read"
      subtitle={`graph: ${AGENT_ID}`}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <YourMainContent />
        <div className="min-h-0 border-t border-slate-200 md:border-l md:border-t-0 dark:border-slate-800">
          <CopilotChat agentId={AGENT_ID} className="h-full" />
        </div>
      </div>
    </DemoFrame>
  );
}
