import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/prebuilt-components/chat-controls" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Two unrelated controls that share a page: opening and closing a
          prebuilt chat from your own UI, and capturing thumbs-up / thumbs-down
          on assistant messages. The first goes through{" "}
          <code>useCopilotChatConfiguration()</code>, whose{" "}
          <code>setModalOpen</code> only exists when something in the tree owns
          modal state — the prebuilt Popup and Sidebar create it, a bare{" "}
          <code>&lt;CopilotChat&gt;</code> does not. The second is a pair of
          handlers on the <code>messageView.assistantMessage</code> slot; the
          buttons render only when a handler is present.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Say something I can rate."]}
            expect="Both buttons drive the sidebar's open state, and the thumbs on the assistant reply append a line to the Feedback list with the message id."
            fail="The buttons render nothing at all — they are outside a provider that owns modal state, which is what the guard in the snippet is checking for."
          />
        </div>
      </Panel>

      <Panel title="The demo">
        <SourceCode file="frontend/src/app/prebuilt-components/chat-controls/demo-chat/page.tsx" />
      </Panel>

      <Callout tone="warn" title="A detail in the published snippets">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            The feedback handlers call{" "}
            <code>analytics.track(&quot;feedback&quot;, …)</code>.{" "}
            <code>analytics</code> is not a global, not imported, and not
            explained. This route records into local React state instead so the
            call is visible.
          </li>
        </ul>
      </Callout>
    </>
  );
}
