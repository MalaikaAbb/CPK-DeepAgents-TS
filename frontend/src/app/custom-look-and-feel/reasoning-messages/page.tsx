import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/reasoning-messages" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The reasoning card&apos;s three slots — <code>header</code>,{" "}
          <code>contentView</code>, <code>toggle</code> — overridden through{" "}
          <code>messageView.reasoningMessage</code>, or the whole card
          re-laid-out with a <code>children</code> render function. The
          component code is the page&apos;s, mounted in four tabs.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={["Think step by step: what is 17 × 23?"]}
            expect="With a reasoning-capable agent: a 🧠 header while streaming, 💡 after, a monospace content block with a blinking cursor, and on the layout tab a yellow-bordered card. On this harness: an ordinary reply with no reasoning card — there is no reasoning source (see below)."
            fail="A render error when the chat mounts would mean the slot wiring itself is broken."
          />
        </div>
      </Panel>

      <MissingSnippets ids={["deepagents::reasoning-default", "deepagents::reasoning-custom"]}>
        <p>
          These are the page&apos;s demo cells — the agent that actually
          streams reasoning. With none published for Deep Agents, the slots
          run on <code>sample_agent</code>, whose default model emits no
          reasoning, so nothing on this route can show a reasoning card.
          Status <strong>Broken</strong>: the frontend code is in place, the
          agent it needs is missing.
        </p>
      </MissingSnippets>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/custom-look-and-feel/reasoning-messages/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
