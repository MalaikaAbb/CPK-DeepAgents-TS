import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { CodeBlock, Panel } from "@/components/ui";

// The only code block the rendered Deep Agents page prints ("Using CDN
// libraries"), verbatim.
const CDN_EXAMPLE = `<head>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <canvas id="myChart"></canvas>
</body>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/open-generative-ui" />

      <MissingSnippets
        ids={[
          "deepagents::open-gen-ui (enable in the runtime)",
          "deepagents::open-gen-ui (CopilotChat page)",
          "deepagents::open-gen-ui-advanced (runtime)",
          "deepagents::open-gen-ui-advanced (sandbox functions on the provider)",
        ]}
      >
        <p>
          Both setups — the minimal one and the &ldquo;with app tool
          calling&rdquo; one — are missing for Deep Agents, runtime and
          frontend alike. Reference-only, <strong>Broken</strong>.
        </p>
      </MissingSnippets>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            The agent writes a complete HTML/CSS/JS document that streams into
            the chat and runs in a sandbox, switched on in the runtime with no
            per-component frontend code.
          </li>
          <li>
            The advanced setup registers sandbox functions on the provider so
            the generated UI can call back into the app.
          </li>
          <li>
            Generated documents may load libraries from a CDN, as in the one
            snippet the page prints.
          </li>
        </ul>
      </Panel>

      <Panel title="The page's only code">
        <CodeBlock filename="Using CDN libraries" language="html" code={CDN_EXAMPLE} />
      </Panel>
    </>
  );
}
