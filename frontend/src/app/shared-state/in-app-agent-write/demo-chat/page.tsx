"use client";

import { CopilotChat, useAgent, useCopilotKit } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

const AGENT_ID = "shared_state_agent";

//#region write-state
/**
 * The page's `YourMainContent`, with both of its variants side by side.
 *
 * `agent.setState` writes locally and the value ships with the next run.
 * The page's "Re-run the agent with updated state" section starts that run
 * immediately instead of waiting for the user to type. Since the 2026-11 doc
 * sync it calls `copilotkit.runAgent({ agent })` from `useCopilotKit()` (was
 * `agent.runAgent()`), so the run carries frontend tools and context.
 *
 * The page names both handlers `toggleLanguage`; the re-run one is called
 * `toggleLanguageAndRerun` here so both variants can sit side by side. Its
 * body is the page's.
 */
function YourMainContent() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
  });

 const language = (agent.state.language as string) ?? "Not set";
  // ...
  const toggleLanguage = () => {
    agent.setState({ language: language === "english" ? "spanish" : "english" }); 
  };

  //#region rerun
  const { copilotkit } = useCopilotKit();

  const toggleLanguageAndRerun = () => {
    const newLanguage = language === "english" ? "spanish" : "english";
    agent.setState({ language: newLanguage });

    // re-run the agent with updated state
    copilotkit.runAgent({ agent });
  };
  //#endregion


  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Your main content
      </h1>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
        Language: <strong>{language}</strong>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={toggleLanguage}
          className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white"
        >
          Toggle Language
        </button>
        <button
          onClick={toggleLanguageAndRerun}
          className="rounded-md border border-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent)]"
        >
          Toggle + copilotkit.runAgent
        </button>

      </div>

      <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
        {JSON.stringify(agent.state, null, 2)}
      </pre>
    </div>
  );
}
//#endregion

export default function Page() {
  return (
    <DemoFrame
      parentPath="/shared-state/in-app-agent-write"
      subtitle={`graph: ${AGENT_ID}`}
    >
      <div className="flex h-full flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          <YourMainContent />
          <div className="min-h-0 border-t border-slate-200 md:border-l md:border-t-0 dark:border-slate-800">
            <CopilotChat agentId={AGENT_ID} className="h-full" />
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
