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

      <Callout tone="warn" title="Not started: needs a CopilotKit upgrade">
        <p>
          Components and surfaces live in 
          <code>@copilotkit/react-core/v2/generative-ui</code> (
          <code>standardUI</code>, <code>createGenerativeUI</code>, 
          <code>GenerativeUISurface</code>, …) and the provider&apos;s 
          <code>generativeUI</code> prop. That subpath is absent up to 1.79 and present by 1.83;
          this repo locks <code>@copilotkit/react-core</code> 
          1.72.0, where it does not exist. Upgrading CopilotKit (and the
          matching <code>@ag-ui/*</code> pins and lockfile) is outside this doc
          sync, so the page&apos;s code is shown here, not run.
        </p>
        <p className="mt-2">
          When it is built: the section&apos;s runtime snippet uses a TanStack 
          <code>BuiltInAgent</code>; per this repo&apos;s rules that becomes a
          Deep Agents graph on the LangGraph server, with the snippet&apos;s
          prompt and no extra tools.
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
