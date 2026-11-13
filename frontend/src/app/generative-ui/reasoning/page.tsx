import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/generative-ui/reasoning" />

      <MissingSnippets
        ids={[
          "deepagents::reasoning-default (page)",
          "deepagents::reasoning-custom (page)",
          "deepagents::reasoning-custom (reasoning-block)",
        ]}
      >
        <p>
          The rendered Deep Agents page shows no code: the default-rendering
          page, and both files of the custom <code>reasoningMessage</code> slot
          sample, are missing snippets. No reasoning-capable Deep Agents agent
          is published either. Reference-only, <strong>Broken</strong>. The{" "}
          <code>.md</code> fallback (another framework&apos;s showcase) also
          calls unpublished <code>useReasoningDefaultSuggestions</code> /{" "}
          <code>useReasoningCustomSuggestions</code> hooks and a{" "}
          <code>ReasoningBlock</code> component.
        </p>
      </MissingSnippets>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Models that emit reasoning tokens produce AG-UI{" "}
            <code>REASONING_MESSAGE_*</code> events, which the chat renders as
            their own message type.
          </li>
          <li>
            By default that is the built-in{" "}
            <code>CopilotChatReasoningMessage</code> card: &ldquo;Thinking…&rdquo;
            while streaming, then collapsed to &ldquo;Thought for X
            seconds&rdquo;, with Markdown content.
          </li>
          <li>
            For a custom look, pass a component to{" "}
            <code>messageView.reasoningMessage</code> on{" "}
            <code>CopilotChat</code>; it receives the reasoning message, the
            message list and <code>isRunning</code>.
          </li>
        </ul>
      </Panel>
    </>
  );
}
