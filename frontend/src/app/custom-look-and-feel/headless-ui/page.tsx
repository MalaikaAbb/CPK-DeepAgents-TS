import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/headless-ui" />

      <MissingSnippets
        ids={[
          "deepagents::headless-simple (message list + composer)",
          "deepagents::headless-complete (useRenderedMessages)",
          "deepagents::headless-complete (per-role dispatch)",
          "deepagents::headless-complete (tool-call composition)",
          "deepagents::headless-complete (bubble chrome)",
        ]}
      >
        <p>
          Every code cell on the page is missing for Deep Agents, and the{" "}
          <code>.md</code> export&apos;s fences for them are empty too, so no
          framework&apos;s version is printed. The page only names the hooks
          in prose. Reference-only, <strong>Broken</strong>.
        </p>
      </MissingSnippets>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            A chat (or non-chat surface) with no <code>CopilotChat</code> and no
            slots, built on <code>useAgent(&#123; agentId &#125;)</code> for
            messages and run state, <code>useCopilotKit()</code> for{" "}
            <code>copilotkit.runAgent(&#123; agent &#125;)</code>, and{" "}
            <code>useRenderToolCall()</code> to paint tool calls inline.
          </li>
          <li>
            A minimal version maps <code>agent.messages</code> to bubbles and
            only gets text and tool calls; reasoning, activity messages and
            before/after slots need extra wiring.
          </li>
          <li>
            The complete version rebuilds what{" "}
            <code>CopilotChatMessageView</code> does with a hand-written{" "}
            <code>useRenderedMessages</code> hook fed by{" "}
            <code>useRenderToolCall</code>, <code>useRenderActivityMessage</code>{" "}
            and <code>useRenderCustomMessages</code>, plus per-role dispatch and
            plain bubble components.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Closest working code in this repo: the{" "}
          <a href="/headless-threads" className="text-[var(--accent)] underline underline-offset-4">
            Headless Threads
          </a>{" "}
          route builds its own thread list over <code>useThreads</code>, but
          still uses <code>CopilotChat</code> for messages.
        </p>
      </Panel>
    </>
  );
}
