"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Markdown Rendering — the page's three `markdownRenderer` samples, one tab
 * each, against `sample_agent` (the page is frontend-only and names no agent).
 * Bodies are the page's; `export function Chat()` becomes a local named
 * function per section. `agentId` is the only addition.
 *
 * The `.my-link` / `.my-heading` classes the first sample applies have no CSS
 * on the page; the small `<style>` below only makes the override visible and
 * is not from the doc page.
 */

const AGENT_ID = "sample_agent";

//#region components-map
function ComponentsMapChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        assistantMessage: {
          markdownRenderer: {
            components: {
              a: ({ node, children, ...props }) => (
                <a {...props} className="my-link">
                  {children}
                </a>
              ),
              h2: ({ node, children, ...props }) => (
                <h2 {...props} className="my-heading">
                  {children}
                </h2>
              ),
            },
          },
        },
      }}
    />
  );
}
//#endregion

//#region class-string
function ClassStringChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{
        assistantMessage: { markdownRenderer: "text-sm leading-7" },
      }}
    />
  );
}
//#endregion

//#region replace-renderer
const PlainText = ({ content }: { content: string }) => (
  <pre className="whitespace-pre-wrap">{content}</pre>
);

function ReplaceRendererChat() {
  return (
    <CopilotChat
      agentId={AGENT_ID}
      messageView={{ assistantMessage: { markdownRenderer: PlainText } }}
    />
  );
}
//#endregion

const TABS = [
  { id: "components", label: "components map (a, h2)", C: ComponentsMapChat },
  { id: "class", label: "class string", C: ClassStringChat },
  { id: "replace", label: "replace renderer (PlainText)", C: ReplaceRendererChat },
] as const;

type TabId = (typeof TABS)[number]["id"];

// NOT FROM THE DOC PAGE: visual marker for the page's `.my-link` / `.my-heading`.
const MARKER_CSS = `.my-link { color: #c2410c; text-decoration: underline dotted; }
.my-heading { border-left: 4px solid #c2410c; padding-left: 0.5rem; }`;

export default function Page() {
  const [tab, setTab] = useState<TabId>("components");
  const Active = TABS.find((t) => t.id === tab)!.C;

  return (
    <DemoFrame parentPath="/custom-look-and-feel/markdown" subtitle={`agent: ${AGENT_ID} · markdownRenderer slot`}>
      <style>{MARKER_CSS}</style>
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
