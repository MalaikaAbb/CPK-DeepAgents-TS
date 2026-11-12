import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// Every React code block the rendered Deep Agents page prints, verbatim.
const BLOCK_0 = `Here is an estimate you can play with:

\`\`\`a2ui
{"version":"1.0","createSurface":{"surfaceId":"plan-estimator","dataModel":{"seats":10,"price":"$290 / month"},"components":[{"id":"root","component":"Card","children":["seats","price"]}]}}
{"version":"1.0","updateComponents":{"surfaceId":"plan-estimator","components":[{"id":"seats","component":"Slider","label":"Seats","min":1,"max":50,"value":{"@path":"/seats"}},{"id":"price","component":"Text","text":{"@path":"/price"}}]}}
\`\`\`

Move the slider to change the seat count.`;

const BLOCK_1 = `{
  "1.0": {
    "supportedCatalogIds": ["copilotkit/standard@1"],
    "inlineCatalogs": [
      {
        "catalogId": "copilotkit/standard@1",
        "protocolVersion": "1.0",
        "components": { "Card": { "props": { "type": "object" } } },
        "functions": {},
        "instructions": "You can show interactive UI in your reply ..."
      }
    ]
  },
  "metadata": {
    "extensions": {
      "copilotkit_format": 3,
      "copilotkit_transport": "markdown",
      "copilotkit_targets": [{ "id": "chat", "kind": "chat" }],
      "copilotkit_surfaces": {},
      "copilotkit_contextSent": false
    }
  }
}`;

const BLOCK_2 = `ui = input.forwarded_props["copilotkit"]["ui"]
catalog = ui["1.0"]["inlineCatalogs"][0]
system = f"{MY_PROMPT}\\n\\n{catalog['instructions']}\\n\\nComponents:\\n{json.dumps(catalog['components'])}"`;

const BLOCK_3 = `import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { standardUI } from "@copilotkit/react-core/v2/generative-ui";

<CopilotKitProvider runtimeUrl="/api/copilotkit" generativeUI={{ ui: standardUI, transport: "markdown" }}>
  {children}
</CopilotKitProvider>;`;

const BLOCK_4 = `<CopilotKitProvider
  runtimeUrl="/api/copilotkit"
  generativeUI={{ ui: standardUI, transport: "markdown", sendContext: false }}
>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/components/markdown-mode" />

      <Callout tone="info" title="How this route is wired">
        <p>
          The demo runs on <code>/api/copilotkit-genui</code>
          , the section&apos;s runtime mounted beside the main
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
          The agent writes UI as a2ui code blocks inside its markdown reply, streamed and rendered with no tool call.
        </p>
      </Panel>

      <Panel
        title="The page's React code, verbatim (not mounted)"
        description="Angular tabs omitted; this is a React harness."
      >
        <div className="space-y-4">
          <CodeBlock filename="page code" language="tsx" code={BLOCK_0} />
          <CodeBlock filename="page code" language="json" code={BLOCK_1} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_2} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_3} />
          <CodeBlock filename="page code" language="tsx" code={BLOCK_4} />
        </div>
      </Panel>
    </>
  );
}
