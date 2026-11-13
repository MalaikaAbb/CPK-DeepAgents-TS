import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every code block the rendered Deep Agents page prints, verbatim, shown as
// reference. Nothing here is mounted: see the callout.
const TS_0 = `import { CopilotRuntime, InMemoryAgentRunner } from "@copilotkit/runtime/v2";

// Simple — enable with defaults
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: true,
  runner: new InMemoryAgentRunner(),
});

// Or customise — e.g. inject a render tool into the agent
const runtime = new CopilotRuntime({
  agents: { default: myAgent },
  a2ui: {
    injectA2UITool: true,
  },
  runner: new InMemoryAgentRunner(),
});`;
const PY_0 = `from copilotkit import a2ui

a2ui.create_surface(surface_id)
a2ui.update_components(surface_id, components)
a2ui.update_data_model(surface_id, {"items": data})
a2ui.render(operations)  # wraps in a2ui_operations and serializes`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/a2ui" />

      <Callout tone="warn" title="Agent side is Python-only for Deep Agents">
        <p>
          The only agent-side code is the Python <code>copilotkit.a2ui</code> helper API. There is no TypeScript equivalent on the page, and the runtime snippets register an undefined <code>myAgent</code>. This repo implements the TypeScript variant only and does
          not translate Python (AGENTS.md), and without an agent the
          TypeScript runtime snippets have nothing to serve. Reference-only, 
          <strong>Broken</strong>.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>A2UI lets an agent describe UI declaratively (surfaces, components, a data model) that the frontend renders with its component catalog.</li>
          <li>The runtime turns it on with an <code>a2ui</code> option: <code>true</code> for defaults, or an object such as <code>&#123; injectA2UITool: true &#125;</code> to give the agent a render tool.</li>
          <li>Agent-side, the page uses the Python <code>copilotkit.a2ui</code> helpers to build operations; two approaches follow on the sub-pages (dynamic and fixed schema).</li>
        </ul>
      </Panel>

      <Panel title="Everything the rendered page prints">
        <div className="space-y-4">
          <CodeBlock filename={`app/api/copilotkit/[[...slug]]/route.ts`} language="tsx" code={TS_0} />
          <CodeBlock filename={`Python helpers — Python only`} language="python" code={PY_0} />
        </div>
      </Panel>
    </>
  );
}
