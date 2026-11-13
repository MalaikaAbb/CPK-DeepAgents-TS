import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The only code block the rendered Deep Agents page prints: an example of the
// agent's output, verbatim.
const EXAMPLE_OUTPUT = `{
  "root": "revenue-card",
  "elements": {
    "revenue-card": {
      "type": "MetricCard",
      "props": { "label": "Total revenue", "value": "$184,302", "trend": "+12%" },
      "children": ["by-region"]
    },
    "by-region": {
      "type": "BarChart",
      "props": {
        "title": "Revenue by region",
        "description": null,
        "data": [
          { "label": "North America", "value": 112000 },
          { "label": "EMEA", "value": 72302 }
        ]
      }
    }
  }
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/json-render" />

      <Callout tone="warn" title="No Deep Agents code on the rendered page">
        <p>
          The page&apos;s demo picker offers Built-in Agent and LangGraph
          (Python / TypeScript) only, the Code tab has no files for Deep
          Agents, and the rendered page prints just one example of agent
          output. The frontend (<code>JsonRenderAssistantMessage</code>,{" "}
          <code>catalog.ts</code>, <code>registry.tsx</code>,{" "}
          <code>types.ts</code>) and the agent that emits the spec are not
          published for this framework. The <code>.md</code> export&apos;s
          fallback files are another framework&apos;s demo and import
          unpublished <code>./registry</code>, <code>./types</code> and{" "}
          <code>./suggestions</code> modules. Reference-only,{" "}
          <strong>Broken</strong>; <code>@json-render/*</code> is not installed.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The agent replies with one <code>&#123; root, elements &#125;</code>{" "}
            JSON object; each element is <code>&#123; type, props, children &#125;</code>{" "}
            naming a component from your own catalog.
          </li>
          <li>
            A custom <code>messageView.assistantMessage</code> parses the
            streamed content and, once it is a valid spec, renders it through{" "}
            <code>@json-render/react</code>&apos;s <code>Renderer</code> inside a{" "}
            <code>JSONUIProvider</code>, falling back to the normal bubble
            until then.
          </li>
          <li>
            The parser allowlists component types but does not validate props
            against the Zod catalog at runtime.
          </li>
        </ul>
      </Panel>

      <Panel title="Example agent output (the page's only code)">
        <CodeBlock filename="example agent output" language="json" code={EXAMPLE_OUTPUT} />
      </Panel>
    </>
  );
}
