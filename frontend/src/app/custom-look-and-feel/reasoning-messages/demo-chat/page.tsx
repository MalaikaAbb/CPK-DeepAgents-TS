"use client";

import {
  CopilotChat,
  CopilotChatReasoningMessage,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Reasoning Messages — the page's slot samples, one tab each. Component
 * bodies and `messageView` props are the page's; `agentId` is added.
 *
 * NO REASONING SOURCE. The slots only render when the agent emits
 * `REASONING_MESSAGE_*` events. The page's agent for this ("reasoning-default"
 * / "reasoning-custom") is a missing `deepagents::reasoning-*` snippet, so no
 * reasoning Deep Agent exists here. The tabs run on `sample_agent` (default
 * model gpt-4o, which emits no reasoning) so the slot wiring compiles and
 * mounts, but no reasoning card appears. README §9 N8.
 */

const AGENT_ID = "sample_agent";

//#region custom-header
function CustomHeader({
  isOpen,
  label,
  hasContent,
  isStreaming,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen?: boolean;
  label?: string;
  hasContent?: boolean;
  isStreaming?: boolean;
}) {
  return (
    <button
      className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium"
      {...props}
    >
      {isStreaming ? "🧠" : "💡"}
      <span>{label}</span>
      {hasContent && (
        <span className="ml-auto text-xs">{isOpen ? "Hide" : "Show"}</span>
      )}
    </button>
  );
}
//#endregion

//#region custom-content
function CustomContent({
  isStreaming,
  hasContent,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isStreaming?: boolean;
  hasContent?: boolean;
}) {
  if (!hasContent && !isStreaming) return null;

  return (
    <div className="px-4 pb-3 text-sm text-gray-500 font-mono" {...props}>
      {children}
      {isStreaming && <span className="animate-pulse ml-1">▊</span>}
    </div>
  );
}
//#endregion

//#region custom-layout
function MyReasoningLayout(props: React.ComponentProps<typeof CopilotChatReasoningMessage>) {
  return (
    <CopilotChatReasoningMessage {...props}>
      {({ header, toggle }) => (
        <div className="rounded-lg border bg-yellow-50 my-2">
          {header}
          {toggle}
        </div>
      )}
    </CopilotChatReasoningMessage>
  );
}
//#endregion

function HeaderAndContentChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        reasoningMessage: {
          header: CustomHeader,
          contentView: CustomContent,
        },
      }}
    />
  );
}

function HeaderChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        reasoningMessage: { header: CustomHeader },
      }}
    />
  );
}

function ContentChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        reasoningMessage: { contentView: CustomContent },
      }}
    />
  );
}

function LayoutChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        // @ts-expect-error -- the page's pattern: a plain function component is not assignable to the `reasoningMessage` slot, typed as `typeof CopilotChatReasoningMessage` including its static Header/Content/Toggle at 1.72 (TS2322). README §9 N8.
        reasoningMessage: MyReasoningLayout,
      }}
    />
  );
}

const TABS = [
  { id: "both", label: "header + contentView", C: HeaderAndContentChat },
  { id: "header", label: "Custom header", C: HeaderChat },
  { id: "content", label: "Custom content", C: ContentChat },
  { id: "layout", label: "Custom layout (children)", C: LayoutChat },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("both");
  const Active = TABS.find((t) => t.id === tab)!.C;

  return (
    <DemoFrame parentPath="/custom-look-and-feel/reasoning-messages" subtitle={`agent: ${AGENT_ID} · reasoningMessage slots (no reasoning source)`}>
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
        <div key={tab} className="min-h-0 flex-1">
          <Active />
        </div>
      </div>
    </DemoFrame>
  );
}
