import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// The page's v1 sample, shown not mounted: it imports from
// `@copilotkit/react-ui`, which this v2 harness does not install.
const V1_CSS_PROPERTIES = `import { CopilotKitCSSProperties } from "@copilotkit/react-ui";

<div
  style={
    {
      "--copilot-kit-primary-color": "#222222",
    } as CopilotKitCSSProperties
  }
>
  <CopilotSidebar />
</div>`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/css" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Restyling the chat with plain CSS: override the v2 shadcn-style
          design tokens on <code>[data-copilotkit]</code>, target the{" "}
          <code>.copilotKit*</code> class names for structural and font
          tweaks, and change copy through the <code>labels</code> prop. The
          page is frontend-only, so the demo uses <code>sample_agent</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Open each tab and send 'hi'"]}
            expect="v2 design tokens: the send button and accents turn indigo (oklch 0.55 0.22 264) and corners use the 0.625rem radius. Classes + fonts: user bubbles go blue (#007AFF) and the message list gets 2rem padding. labels prop: the welcome text reads 'Hello! How can I help you today?' and the input placeholder 'Ask me anything!'."
            fail="A tab that looks identical to the default chat. For the class tab that would mean the v2 components no longer carry the .copilotKit* names the page targets."
          />
        </div>
      </Panel>

      <MissingSnippets
        ids={[
          "deepagents::chat-customization-css (page import)",
          "deepagents::chat-customization-css (theme variables)",
          "deepagents::chat-customization-css (user-bubble block)",
        ]}
      >
        <p>
          The demo&apos;s scoped <code>theme.css</code> (the page&apos;s
          worked example) is not published for Deep Agents. The generic
          samples the page does render are all implemented in the demo, except
          the v1 one below.
        </p>
      </MissingSnippets>

      <Callout tone="warn" title="The v1 sample can't be mounted here">
        The <code>CopilotKitCSSProperties</code> sample imports from{" "}
        <code>@copilotkit/react-ui</code>, the deprecated v1 UI package, and
        sets a v1 <code>--copilot-kit-*</code> variable. The page&apos;s own
        callout says those variables only style v1 components. This harness
        is v2-only and does not install <code>@copilotkit/react-ui</code>, so
        the sample is shown below rather than run.
      </Callout>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/custom-look-and-feel/css/demo-chat/page.tsx" />
      </Panel>

      <Panel title="v1 CopilotKitCSSProperties (page sample, not mounted)">
        <CodeBlock code={V1_CSS_PROPERTIES} language="tsx" />
      </Panel>
    </>
  );
}
