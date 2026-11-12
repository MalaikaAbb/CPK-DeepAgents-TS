import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `const runtime = new CopilotRuntime({
  agents: { default: agent },
  generativeUI: true,
});`;

const BLOCK_1 = `<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  generativeUI={{ ui: standardUI, agentIds: ["shop"] }}
>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/transports" />

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs on <code>/api/copilotkit-genui</code>
           (for this page, <code>/api/copilotkit-genui-transports</code> with the page&apos;s <code>generativeUI: true</code>), the section&apos;s runtime mounted beside the main
          one. Its agent is <code>components_agent</code>, a Deep Agents graph
          standing in for the section&apos;s TanStack <code>BuiltInAgent</code>
          (same prompt, no tools; <code>copilotkitMiddleware</code> hands it
          the run&apos;s <code>render_ui</code> tool and context). Each
          provider&apos;s <code>generativeUI</code> value is the page&apos;s;
          only its <code>runtimeUrl</code> differs. Needs CopilotKit 1.87
          (this repo was on 1.72.0, which has no{" "}
          <code>v2/generative-ui</code>). What runs and what stays broken is in
          the status note above.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          How the agent delivers generated UI: a render_ui tool call, or a2ui blocks inside its markdown reply.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="app/api/copilotkit/route.ts" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_1} />
        </div>
      </Panel>
    </>
  );
}
