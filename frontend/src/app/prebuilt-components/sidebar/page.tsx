import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const PAGE_IMPORT = `import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/sidebar" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A collapsible chat docked to the edge of the app, toggled by a launcher, living beside the main content rather than over it.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Lisbon?"]}
            expect="A launcher button at the edge opens a docked sidebar chat; the main content stays visible beside it. The reply says Lisbon is sunny."
            fail="No reply or an error banner — the agent server or runtime route is down (check /quickstart)."
          />
        </div>
      </Panel>

      <MissingSnippets
        ids={[
          "deepagents::prebuilt-sidebar (basic setup)",
          "deepagents::prebuilt-sidebar (configuring the sidebar)",
        ]}
      >
        <p>
          Only the import line is published. The demo mounts the component
          with nothing but <code>agentId</code> (a prop from the page&apos;s own
          table), labelled as not from the doc page, so it is ⚠️ Partial.
        </p>
      </MissingSnippets>

      <Callout tone="info" title="v1 name clash">
        The page warns that <code>@copilotkit/react-ui</code> (deprecated v1)
        exports a component with the same name. This harness imports only
        from <code>@copilotkit/react-core/v2</code>.
      </Callout>

      <Panel title="The page's import">
        <CodeBlock code={PAGE_IMPORT} language="tsx" />
      </Panel>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/prebuilt-components/sidebar/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
