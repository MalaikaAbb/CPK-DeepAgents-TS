"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * CSS Customization — the rendered Deep Agents page's v2-applicable samples,
 * one tab each, against `sample_agent`:
 *
 *   tokens  — the page's `globals.css` block overriding the v2 shadcn tokens
 *             on `[data-copilotkit]` (plus the `.dark` variant).
 *   classes — the page's two `globals.css` blocks targeting `.copilotKit*`
 *             class names (structure + fonts).
 *   labels  — `<CopilotChat labels={...}>`.
 *
 * The page labels its CSS `globals.css`. Here each block is injected with a
 * `<style>` element only while its tab is mounted, so the overrides don't
 * restyle every other route in the harness. The CSS text is the page's.
 *
 * Not mounted: the `CopilotKitCSSProperties` sample, which imports from
 * `@copilotkit/react-ui` (the deprecated v1 package this repo does not
 * install) and wraps a `CopilotSidebar` with a v1 `--copilot-kit-*` variable.
 * It is shown on the notes page.
 */

//#region v2-tokens
const V2_TOKENS_CSS = `[data-copilotkit] {
  --primary: oklch(0.55 0.22 264); /* accent / action color */
  --primary-foreground: oklch(0.99 0 0); /* text on primary */
  --background: oklch(1 0 0); /* surface background */
  --foreground: oklch(0.145 0 0); /* primary text */
  --muted: oklch(0.97 0 0); /* subtle backgrounds */
  --border: oklch(0.922 0 0); /* dividers, outlines */
  --radius: 0.625rem; /* global corner radius */
}

/* Dark mode is keyed off a \`.dark\` ancestor */
.dark [data-copilotkit] {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --border: oklch(0.269 0 0);
}`;
//#endregion

//#region class-overrides
const CLASS_CSS = `.copilotKitButton {
  border-radius: 0;
}

.copilotKitMessages {
  padding: 2rem;
}

.copilotKitUserMessage {
  background: #007AFF;
}`;

const FONT_CSS = `.copilotKitMessages {
  font-family: "Arial, sans-serif";
}

.copilotKitInput {
  font-family: "Arial, sans-serif";
}`;
//#endregion

//#region labels
function LabelsChat() {
  return (
    <CopilotChat
      agentId="sample_agent"
      labels={{
        welcomeMessageText: "Hello! How can I help you today?",
        modalHeaderTitle: "My Copilot",
        chatInputPlaceholder: "Ask me anything!",
      }}
    />
  );
}
//#endregion

const TABS = [
  { id: "tokens", label: "v2 design tokens" },
  { id: "classes", label: ".copilotKit* classes + fonts" },
  { id: "labels", label: "labels prop" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Page() {
  const [tab, setTab] = useState<TabId>("tokens");

  return (
    <DemoFrame parentPath="/custom-look-and-feel/css" subtitle="agent: sample_agent · CSS customization">
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
        {tab === "tokens" && <style>{V2_TOKENS_CSS}</style>}
        {tab === "classes" && <style>{`${CLASS_CSS}\n\n${FONT_CSS}`}</style>}
        <div key={tab} className="min-h-0 flex-1">
          {tab === "labels" ? <LabelsChat /> : <CopilotChat agentId="sample_agent" />}
        </div>
      </div>
    </DemoFrame>
  );
}
