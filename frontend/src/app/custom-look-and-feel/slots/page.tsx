import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/slots" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Every part of <code>CopilotChat</code> is a named slot, and each slot
          prop takes one of three things: a Tailwind class string merged into
          the default, an object of props for the default component, or your
          own component in its place. Slots nest, so{" "}
          <code>messageView.assistantMessage.copyButton</code> reaches three
          levels down. The demo has one tab per sample, all on{" "}
          <code>sample_agent</code>.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Say hi, then switch tabs and say hi again", "On toolCallsView: What's the weather in Paris?"]}
            expect="Tailwind: grey message area and a blue-bordered input. Props override: input is focused on load and the message view has data-testid=message-view. Custom component: plain left/right text lines plus 'Thinking...' while running. Nested slots: dashed custom user bubble, dashed toolbar and 'Copy (custom)'. Three levels deep: a plain 'Copy' button under replies. toolCallsView: the get_weather call sits in a dashed box. Labels: the custom placeholder, welcome text and disclaimer."
            fail="A tab that renders the default chat, or a crash when the custom message view receives non-string content."
          />
        </div>
      </Panel>

      <MissingSnippets
        ids={[
          "deepagents::chat-slots (welcome screen)",
          "deepagents::chat-slots (assistant message)",
          "deepagents::chat-slots (disclaimer)",
        ]}
      >
        <p>
          The page&apos;s worked example — a custom welcome screen, a wrapped
          assistant-message card, and an <code>input.disclaimer</code>{" "}
          override — is not published for Deep Agents. The generic samples
          below it are all mounted.
        </p>
      </MissingSnippets>

      <Callout tone="warn" title="Components the page names but never defines, and two type errors">
        <p>
          The &ldquo;Nested Slots&rdquo; sample passes <code>CustomToolbar</code>,{" "}
          <code>CustomCopyButton</code> and <code>CustomUserMessage</code>{" "}
          without defining them. Minimal stand-ins are in the demo file,
          labelled <em>not from the doc page</em>.
        </p>
        <p className="mt-2">
          Two samples don&apos;t typecheck as printed and carry{" "}
          <code>@ts-expect-error</code>: the custom <code>messageView</code>{" "}
          component destructures untyped props, and neither it nor any plain
          function component is assignable to a slot whose type is the default
          component&apos;s <code>typeof</code> (which includes its static
          sub-components). Same for <code>userMessage</code>. README §9 N6.
        </p>
      </Callout>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/custom-look-and-feel/slots/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
