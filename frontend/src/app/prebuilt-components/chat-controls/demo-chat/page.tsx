"use client";

import {
  CopilotChatConfigurationProvider,
  CopilotPopup,
  CopilotSidebar,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Both halves of the chat-controls page in one surface.
 *
 * `OpenChatButton` keeps the page's guard and comment, but its body follows the
 * aws-strands-ts harness: it owns an `open` state and drives a `CopilotPopup`
 * through `open` / `onOpenChange` (the page's own snippet calls
 * `config.setModalOpen(true)`). The toggle beneath it is the page's second
 * snippet, wrapped in the same guard.
 *
 * Why the explicit `<CopilotChatConfigurationProvider>` below, when the page's
 * own prose says the prebuilt surfaces "create it for you": they create it
 * *inside themselves*. A button rendered as a sibling of `<CopilotSidebar>` is
 * not in that subtree, so `useCopilotChatConfiguration()` returns null, the
 * guard fires, and both buttons render nothing at all. The page's callout is
 * the fix — "if you compose chat yourself, wrap the relevant subtree in
 * `<CopilotChatConfigurationProvider isModalDefaultOpen={false}>` so the modal
 * state exists" — and composing your own controls beside the chat counts as
 * composing chat yourself, which the callout does not spell out.
 *
 * Wrapping works because the provider is bidirectional: it reads a
 * `parentConfig` from context, and its setter both updates its own state and
 * calls `parentConfig.setModalOpen`, while an effect mirrors the parent's value
 * back down. The sidebar's inner provider therefore treats the one below as its
 * parent and delegates to it, so the buttons and the sidebar share one state
 * rather than forking into two.
 *
 * `defaultOpen` is deliberately absent from `<CopilotSidebar>` for the same
 * reason: with no explicit default, the inner provider defers to the outer one
 * entirely. The initial closed state comes from `isModalDefaultOpen={false}`
 * here, so there is exactly one source of truth.
 *
 * The feedback half is the third snippet: `onThumbsUp` / `onThumbsDown` on the
 * `messageView.assistantMessage` slot. The buttons only render when a handler
 * is supplied. The page routes them to `analytics.track(...)`, which is not a
 * real global anywhere; this records into local state so you can see the call
 * land.
 *
 * Layout matches the aws-strands-ts harness's route for the same page. It runs
 * on `sample_agent`, this repo's existing agent (the page passes no
 * `agentId` and this runtime has no "default" agent).
 */

const AGENT_ID = "sample_agent";

function OpenChatButton() {
  const config = useCopilotChatConfiguration();
  const [chatOpen, setChatOpen] = useState(false);

  // setModalOpen is only present when a provider in the tree owns modal state
  // (the prebuilt CopilotPopup / CopilotSidebar create it for you).
  if (!config?.setModalOpen) return null;

  return (
  <>
      <nav>
        <button onClick={() => setChatOpen(!chatOpen)}>Ask the assistant (Popup)</button>
      </nav>
      <CopilotPopup agentId={AGENT_ID} open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}

function ToggleChatButton() {
  const config = useCopilotChatConfiguration();
  if (!config?.setModalOpen) return null;

  return (
    <button onClick={() => config.setModalOpen(!config.isModalOpen)}>
      {config.isModalOpen ? "Close Sidebar" : "Open Sidebar"}
    </button>
  );
}

type Feedback = { id: string; value: "up" | "down" };

export default function Page() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  return (
    <DemoFrame
      parentPath="/prebuilt-components/chat-controls"
      subtitle={`agent: ${AGENT_ID}`}
    >
      {/* Owns the modal state both the buttons and the sidebar read. */}
      <CopilotChatConfigurationProvider isModalDefaultOpen={false}>
        <main className="h-full overflow-y-auto p-10">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Driving the chat from your own UI
          </h1>
          <p className="mt-2 max-w-prose text-sm text-slate-600 dark:text-slate-400">
            The sidebar starts closed. Both buttons below drive it, and the
            toggle&apos;s label tracks its state — that is{" "}
            <code>isModalOpen</code> and <code>setModalOpen</code> read straight
            off the chat configuration context.
            <br/>
            <b>RATINGS/FEEDBACK CONFIGURATION IS IN SIDEBAR</b>
          </p>

          <div className="mt-6 flex flex-wrap gap-3 [&_button]:rounded-md [&_button]:border [&_button]:border-slate-300 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-sm dark:[&_button]:border-slate-700">
            <OpenChatButton />
            <ToggleChatButton />
          </div>

          <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Feedback recorded
            </h2>
            {feedback.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                Send a message, then use the thumbs on the assistant reply.
              </p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {feedback.map((f, i) => (
                  <li key={`${f.id}-${i}`} className="font-mono text-xs">
                    {f.value === "up" ? "👍" : "👎"} {f.id}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* No `defaultOpen` — see the note above. */}
          <CopilotSidebar
            agentId={AGENT_ID}
            position="left"
            messageView={{
              assistantMessage: {
                onThumbsUp: (message: { id: string }) => {
                  setFeedback((prev) => [
                    ...prev,
                    { id: message.id, value: "up" },
                  ]);
                },
                onThumbsDown: (message: { id: string }) => {
                  setFeedback((prev) => [
                    ...prev,
                    { id: message.id, value: "down" },
                  ]);
                },
              },
            }}
          />
        </main>
      </CopilotChatConfigurationProvider>
    </DemoFrame>
  );
}
