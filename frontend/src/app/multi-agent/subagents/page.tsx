import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { CodeBlock, Panel } from "@/components/ui";

// The only code the rendered Deep Agents page shows: two inline fragments in
// the "Rendering a live delegation log" prose.
const INLINE_FRAGMENTS = `useAgent({ updates: [UseAgentUpdate.OnStateChanged, UseAgentUpdate.OnRunStatusChanged] })
agent.state.delegations`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/multi-agent/subagents" />

      <MissingSnippets
        ids={["deepagents::subagents (setup)", "deepagents::subagents (supervisor tools)", "deepagents::subagents (delegation log)"]}
      >
        <p>
          All three code cells are missing: the sub-agent definitions, the
          supervisor tools that run them and append to a shared{" "}
          <code>delegations</code> list, and the frontend delegation-log
          component. With no agent, no tools and no component published for
          Deep Agents, the route is reference-only and marked{" "}
          <strong>Broken</strong>. The <code>.md</code> export&apos;s fallback is
          a LangGraph Python <code>create_agent</code> supervisor plus a
          showcase <code>DelegationLog</code> that references undefined{" "}
          <code>SUB_AGENT_STYLE</code>, <code>SubAgentName</code> and{" "}
          <code>DelegationLogProps</code>; none of it is Deep Agents
          TypeScript.
        </p>
      </MissingSnippets>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            A supervisor agent exposes each specialised sub-agent (research,
            writing, critique) as a tool; each tool runs its sub-agent on a
            task string and returns the final message to the supervisor.
          </li>
          <li>
            Each delegation is also written to a <code>delegations</code> slot
            in shared agent state, which the frontend renders live as a log.
          </li>
          <li>
            A warning: give each delegation a stable <code>id</code> and merge
            by it, because the client echoes shared state back on every run
            and an append-only reducer doubles the log on continued threads.
          </li>
        </ul>
      </Panel>

      <Panel title="The only code the rendered page shows">
        <CodeBlock code={INLINE_FRAGMENTS} language="ts" filename="inline, in prose" />
      </Panel>
    </>
  );
}
