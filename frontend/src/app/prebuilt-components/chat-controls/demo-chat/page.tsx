"use client";

import {
  CopilotChat,
  CopilotSidebar,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Open, close, and feedback — the page's samples in three tabs, on
 * `sample_agent` (`agentId` added to every surface; the page passes none and
 * this runtime has no "default" agent).
 *
 *   controlled — `Layout`: a button outside the sidebar drives `open` /
 *                `onOpenChange`.
 *   context    — `OpenChatButton` calling `setModalOpen(true)` from the chat
 *                configuration context, plus the page's toggle line and its
 *                `<CopilotSidebar defaultOpen={false} />`.
 *   feedback   — `onThumbsUp` / `onThumbsDown` on the assistant-message slot.
 *                The handlers call `analytics.track`, which the page never
 *                defines: clicking a thumb throws ReferenceError (README §9).
 */

const AGENT_ID = "sample_agent";

//#region controlled
function Layout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <nav>
        <button onClick={() => setChatOpen(true)}>Ask the assistant</button>
      </nav>

      <CopilotSidebar agentId={AGENT_ID} open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
//#endregion

//#region context
function OpenChatButton() {
  const config = useCopilotChatConfiguration();

  // setModalOpen is only present when a provider in the tree owns modal state
  // (the prebuilt CopilotPopup / CopilotSidebar create it for you).
  if (!config?.setModalOpen) return null;

  return (
    <button onClick={() => config.setModalOpen(true)}>
      Ask the assistant
    </button>
  );
}

// The page's toggle is a single `<button>` line that reads `config`; it is
// wrapped in the same guard as `OpenChatButton` so it has a `config` to read.
// The wrapper (name + guard) is not from the doc page.
function ToggleChatButton() {
  const config = useCopilotChatConfiguration();
  if (!config?.setModalOpen) return null;

  return (
    <button onClick={() => config.setModalOpen(!config.isModalOpen)}>
      Toggle the assistant
    </button>
  );
}

function ContextControls() {
  return (
    <>
      <nav className="flex gap-3">
        <OpenChatButton />
        <ToggleChatButton />
      </nav>
      <CopilotSidebar agentId={AGENT_ID} defaultOpen={false} />
    </>
  );
}
//#endregion

//#region feedback
function FeedbackChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        assistantMessage: {
          onThumbsUp: (message) => {
            // @ts-expect-error -- `analytics` is used by the page and never defined (README §9 N10). Throws ReferenceError on click.
            analytics.track("feedback", { messageId: message.id, value: "up" });
          },
          onThumbsDown: (message) => {
            // @ts-expect-error -- `analytics` is used by the page and never defined (README §9 N10). Throws ReferenceError on click.
            analytics.track("feedback", { messageId: message.id, value: "down" });
          },
        },
      }}
    />
  );
}
//#endregion

const TABS = [
  { id: "controlled", label: "Controlled open state", C: Layout },
  { id: "context", label: "setModalOpen from context", C: ContextControls },
  { id: "feedback", label: "Thumbs feedback", C: FeedbackChat },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("controlled");
  const Active = TABS.find((t) => t.id === tab)!.C;

  return (
    <DemoFrame parentPath="/prebuilt-components/chat-controls" subtitle={`agent: ${AGENT_ID} · open/close + feedback`}>
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 px-3 py-2 text-xs dark:border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded px-2 py-1 ${
                tab === t.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div key={tab} className="relative min-h-0 flex-1 p-4 text-sm [&_nav_button]:rounded [&_nav_button]:border [&_nav_button]:px-3 [&_nav_button]:py-1">
          <Active />
        </div>
      </div>
    </DemoFrame>
  );
}
