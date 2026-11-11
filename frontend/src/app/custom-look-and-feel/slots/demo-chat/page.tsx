"use client";

import {
  CopilotChat,
  CopilotChatToolCallsView,
  type CopilotChatToolCallsViewProps,
  type CopilotChatUserMessageProps,
} from "@copilotkit/react-core/v2";
import type React from "react";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Slots — every slot sample the rendered Deep Agents page prints, one tab
 * each, against `sample_agent` (the page is frontend-only; its samples name no
 * agent). Sample bodies are the page's. The page's samples are written as
 * `export function Chat()`; here each is a local function named after its
 * section so all of them fit in one file.
 *
 * The page's own worked example (welcome screen, assistant-message card and
 * disclaimer overrides) is three missing `deepagents::chat-slots` snippets and
 * is not here.
 */

const AGENT_ID = "sample_agent";

//#region tailwind
function TailwindChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView="bg-gray-50 dark:bg-gray-900 p-4"
      input="border-2 border-blue-400 rounded-xl"
    />
  );
}
//#endregion

//#region props-override
function PropsOverrideChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        className: "my-custom-messages",
        "data-testid": "message-view",
      }}
      input={{ autoFocus: true }}
    />
  );
}
//#endregion

//#region custom-component
// @ts-expect-error -- page code: the destructured props carry no type annotation (TS7031 implicit any under strict).
const CustomMessageView = ({ messages, isRunning }) => (
  <div className="space-y-4 p-6">
    {messages?.map((msg) => (
      <div key={msg.id} className={msg.role === "user" ? "text-right" : "text-left"}>
        {msg.content}
      </div>
    ))}
    {isRunning && <div className="animate-pulse">Thinking...</div>}
  </div>
);

function CustomComponentChat() {
  // @ts-expect-error -- page code: the untyped component's required { messages, isRunning } don't match the slot's optional props (TS2322).
  return <CopilotChat agentId={AGENT_ID} messageView={CustomMessageView} />;
}
//#endregion

//#region nested-slot-components
/*
 * NOT FROM THE DOC PAGE. The "Nested Slots" sample renders `CustomToolbar`,
 * `CustomCopyButton` and `CustomUserMessage` without defining them. These are
 * minimal stand-ins, typed to the slot props, so the sample can mount. They
 * only make the override visible (dashed outline / label).
 */
function CustomToolbar(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="mt-1 flex gap-1 rounded border border-dashed border-slate-400 p-1 text-xs"
    />
  );
}

function CustomCopyButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" {...props} className="rounded border px-2 py-0.5 text-xs">
      Copy (custom)
    </button>
  );
}

function CustomUserMessage({ message }: CopilotChatUserMessageProps) {
  return (
    <div className="my-2 ml-auto w-fit rounded-lg border border-dashed border-blue-400 px-3 py-2 text-sm">
      <span className="mr-2 text-xs uppercase text-blue-500">custom user</span>
      {typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content)}
    </div>
  );
}
//#endregion

//#region nested-slots
function NestedSlotsChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        assistantMessage: {
          toolbar: CustomToolbar,
          copyButton: CustomCopyButton,
        },
        // @ts-expect-error -- the page's pattern: a plain function component is not assignable to the `userMessage` slot, whose type is `typeof CopilotChatUserMessage` including its static sub-components (Container, MessageRenderer, …) at 1.72 (TS2322). README §9 N6.
        userMessage: CustomUserMessage,
      }}
    />
  );
}

function ThreeLevelsChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        assistantMessage: {
          copyButton: ({ onClick }) => (
            <button onClick={onClick}>Copy</button>
          ),
        },
      }}
    />
  );
}
//#endregion

//#region tool-calls-view
const CustomToolCallsView = (props: CopilotChatToolCallsViewProps) => (
  <div className="rounded-lg border border-dashed p-2">
    <CopilotChatToolCallsView {...props} />
  </div>
);

function ToolCallsViewChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        assistantMessage: { toolCallsView: CustomToolCallsView },
      }}
    />
  );
}
//#endregion

//#region labels
function LabelsChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      labels={{
        chatInputPlaceholder: "Ask your agent anything...",
        welcomeMessageText: "How can I help you today?",
        chatDisclaimerText: "AI responses may be inaccurate.",
      }}
    />
  );
}
//#endregion

const TABS = [
  { id: "tailwind", label: "Tailwind classes", C: TailwindChat },
  { id: "props", label: "Props override", C: PropsOverrideChat },
  { id: "custom", label: "Custom component", C: CustomComponentChat },
  { id: "nested", label: "Nested slots", C: NestedSlotsChat },
  { id: "three", label: "Three levels deep", C: ThreeLevelsChat },
  { id: "toolcalls", label: "toolCallsView", C: ToolCallsViewChat },
  { id: "labels", label: "Labels", C: LabelsChat },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("tailwind");
  const Active = TABS.find((t) => t.id === tab)!.C;

  return (
    <DemoFrame parentPath="/custom-look-and-feel/slots" subtitle={`agent: ${AGENT_ID} · CopilotChat slots`}>
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
