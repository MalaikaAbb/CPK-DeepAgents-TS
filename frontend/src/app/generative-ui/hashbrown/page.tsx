import { RouteHeader } from "@/components/route-header";
import { Callout, CodeBlock, Panel } from "@/components/ui";

// The only code block the rendered Deep Agents page prints: the example
// envelope the agent should send, verbatim.
const EXAMPLE_OUTPUT = `{
  "ui": [
    { "metric": { "props": { "label": "Total Revenue", "value": "$1.2M" } } },
    {
      "pieChart": {
        "props": {
          "title": "Revenue by Segment",
          "data": "[{\\"label\\":\\"Enterprise\\",\\"value\\":600000},{\\"label\\":\\"SMB\\",\\"value\\":400000},{\\"label\\":\\"Startup\\",\\"value\\":200000}]"
        }
      }
    }
  ]
}`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/hashbrown" />

      <Callout tone="warn" title="No Deep Agents code on the rendered page">
        <p>
          The demo picker covers Built-in Agent and LangGraph only and the
          Code tab has no Deep Agents files. The rendered page prints one
          example of the agent&apos;s JSON envelope and describes the rest:
          a <code>HashBrownDashboard</code> provider, a{" "}
          <code>HashBrownRenderMessage</code> assistant-message renderer, the
          UI kit&apos;s components, and the agent. None of it is published for
          Deep Agents, and <code>@hashbrownai/*</code> is not installed here.
          Reference-only, <strong>Broken</strong>.
        </p>
      </Callout>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            A Hashbrown UI kit exposes <code>metric</code>,{" "}
            <code>pieChart</code>, <code>barChart</code>, <code>dealCard</code>{" "}
            and Markdown with prop schemas; the renderer feeds{" "}
            <code>kit.schema</code> to <code>useJsonParser</code> and calls{" "}
            <code>kit.render(value)</code> as the JSON streams.
          </li>
          <li>
            The agent sends one bare JSON object with a top-level{" "}
            <code>ui</code> array; chart <code>data</code> is a JSON-encoded
            string the chart wrappers parse.
          </li>
          <li>
            The page says its bundled demos pin <code>@hashbrownai/core</code>{" "}
            and <code>@hashbrownai/react</code> to <code>0.5.0-beta.4</code>.
          </li>
        </ul>
      </Panel>

      <Panel title="Example agent output (the page's only code)">
        <CodeBlock filename="agent message" language="json" code={EXAMPLE_OUTPUT} />
      </Panel>
    </>
  );
}
