import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

const PAGE_IMPORT = `import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/popup" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          A floating launcher bubble that opens an overlay chat window over the page, for short task-focused chats.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["What's the weather in Lisbon?"]}
            expect="A round launcher in the corner opens an overlay chat window on top of this page. The reply says Lisbon is sunny."
            fail="No reply or an error banner — the agent server or runtime route is down (check /quickstart)."
          />
        </div>
      </Panel>

      <MissingSnippets
        ids={[
          "deepagents::prebuilt-popup (basic setup)",
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
        <SourceCode file="frontend/src/app/prebuilt-components/popup/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
