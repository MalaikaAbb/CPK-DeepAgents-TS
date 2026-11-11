import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every code block the rendered Deep Agents page prints, verbatim, shown as
// reference. Nothing here is mounted: see the callout.
const TS_0 = `const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {
    injectA2UITool: true,
  },
});`;
const TS_1 = `<CopilotKit a2ui={{ catalog: myCatalog }}>
  {/* ... */}
</CopilotKit>`;
const PY_0 = `from copilotkit import CopilotKitMiddleware
from deepagents import create_deep_agent
from langchain_openai import ChatOpenAI

graph = create_deep_agent(
    model=ChatOpenAI(model="gpt-6-luna", reasoning_effort="none"),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=(
        "Whenever a response would benefit from a rich visual — a dashboard, "
        "KPI summary, card layout, or chart — call \`generate_a2ui\` to draw it. "
        "Keep chat replies to one short sentence and let the UI do the talking."
    ),
)`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui/dynamic-schema" />

      <Callout tone="warn" title="Agent side is Python-only for Deep Agents">
        <p>
          The agent is printed only as Python (<code>agent/a2ui_dynamic.py</code>); the frontend snippet uses an undefined <code>myCatalog</code> and the runtime an undefined <code>myAgent</code>. This repo implements the TypeScript variant only and does
          not translate Python (AGENTS.md), and without an agent the
          TypeScript runtime snippets have nothing to serve. Reference-only, 
          <strong>Broken</strong>.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>The runtime injects a <code>generate_a2ui</code> tool (<code>injectA2UITool: true</code>); when the agent calls it, a secondary LLM writes both the A2UI schema and the data from the prompt.</li>
          <li>The frontend passes its component catalog with <code>&lt;CopilotKit a2ui=&#123;&#123; catalog &#125;&#125;&gt;</code>; surfaces stream in progressively with a built-in progress indicator.</li>
          <li>The agent only needs <code>CopilotKitMiddleware</code> and a prompt telling it when to call <code>generate_a2ui</code>.</li>
        </ul>
      </Panel>

      <Panel title="Everything the rendered page prints">
        <div className="space-y-4">
          <CodeBlock filename={`app/api/copilotkit/route.ts`} language="tsx" code={TS_0} />
          <CodeBlock filename={`frontend provider`} language="tsx" code={TS_1} />
          <CodeBlock filename={`agent/a2ui_dynamic.py — Python only`} language="python" code={PY_0} />
        </div>
      </Panel>
    </>
  );
}
