import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/chat-controls" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Three controls for the prebuilt chat: owning the sidebar&apos;s open
          state with <code>open</code> + <code>onOpenChange</code>; opening it
          from anywhere through <code>useCopilotChatConfiguration().setModalOpen</code>{" "}
          without lifting state; and thumbs-up / thumbs-down handlers on the
          assistant-message slot.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Controlled tab: click 'Ask the assistant', then close the sidebar", "Feedback tab: say hi, then click a thumb under the reply"]}
            expect="Controlled: the sidebar opens from the outside button and closes from its own toggle (onOpenChange feeds back into open). Context: 'Ask the assistant' and 'Toggle the assistant' open/toggle the sidebar — or render nothing, if no provider above them owns modal state. Feedback: thumbs appear under assistant replies."
            fail="Feedback: clicking a thumb throws ReferenceError: analytics is not defined — expected, the page never defines `analytics`."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="analytics is never defined">
        Both feedback handlers call <code>analytics.track(...)</code>; the page
        never imports or defines <code>analytics</code>. Kept as printed with{" "}
        <code>@ts-expect-error</code>, so a thumb click throws at runtime.
      </Callout>

      <Callout tone="info" title="Where the context buttons live">
        The page says <code>setModalOpen</code> exists only when a provider in
        the tree owns modal state, which <code>CopilotSidebar</code> creates.
        The buttons here are siblings of the sidebar, not inside it, exactly as
        the page&apos;s <code>Layout</code> places its own button — so whether
        they render is itself the test of that sentence.
      </Callout>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/prebuilt-components/chat-controls/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
