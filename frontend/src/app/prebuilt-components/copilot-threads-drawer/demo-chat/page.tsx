"use client";

import {
  CopilotChat,
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  CopilotThreadsDrawer,
  useCopilotChatConfiguration,
} from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/** The runtime id this demo binds to. Also shown in the demo header. */
const AGENT_ID = "sample_agent";

/**
 * Four tabs, one per code sample on the page:
 *
 *   chat       — the page's original drawer + `CopilotChat` sample.
 *   sidebar    — "Use the Drawer with a sidebar chat" (added 2026-11 sync).
 *   button     — "Add your own New conversation button" (added 2026-11 sync),
 *                with a toggle for the page's `::part()` CSS that hides the
 *                drawer's own new-conversation controls.
 *   controlled — the `ControlledChat` sample from the same section, where the
 *                app owns `threadId` and passes the drawer two callbacks.
 *
 * Two harness-wide departures, the same in every tab:
 *
 *   - `CopilotKitProvider` is not repeated; the app already mounts one at the
 *     root. The doc nests it because each sample is a whole page.
 *   - `agentId={AGENT_ID}` on `CopilotChatConfigurationProvider`. The page's
 *     samples omit it, so the drawer and chat resolve to `"default"` (the
 *     page's own "Which agent's threads the drawer shows" order). This runtime
 *     registers one graph per route and no `"default"`, so the id is set once
 *     on the shared provider, which is the page's own advice for moving the
 *     drawer and chat to another agent together.
 *
 * One presentational departure in the `chat` tab. The doc's wrapper is
 * `<div style={{ display: "flex", height: "100dvh" }}>` with the two components
 * as bare children. In a flex row `CopilotChat` has no flex basis of its own, so
 * it collapses to min-content. `flex: 1` plus `minWidth: 0` gives it the
 * remaining space. `100dvh` becomes `100%` everywhere so the demo fits under
 * the DemoFrame bar.
 */

const TABS = [
  { id: "chat", label: "Drawer + CopilotChat" },
  { id: "sidebar", label: "Drawer + CopilotSidebar" },
  { id: "button", label: "Own New-conversation button" },
  { id: "controlled", label: "App-controlled threadId" },
] as const;

type TabId = (typeof TABS)[number]["id"];

//#region your-main-content
/**
 * NOT FROM THE DOC PAGE. The sidebar sample renders `<YourMainContent />` and
 * never defines it. This placeholder stands in for "your app" so the sidebar
 * has something to sit beside. It does nothing CopilotKit-related.
 */
function YourMainContent() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 600 }}>Your main content</h2>
      <p style={{ fontSize: 14, opacity: 0.7 }}>
        Placeholder for the page&apos;s undefined <code>YourMainContent</code>.
        The chat is the sidebar on the right.
      </p>
    </div>
  );
}
//#endregion

//#region chat
function DrawerWithChat() {
  return (
    <CopilotChatConfigurationProvider agentId={AGENT_ID}>
      <div style={{ display: "flex", height: "100%" }}>
        <CopilotThreadsDrawer />
        <div style={{ flex: 1, minWidth: 0 }}>
          <CopilotChat />
        </div>
      </div>
    </CopilotChatConfigurationProvider>
  );
}
//#endregion

//#region sidebar
function DrawerWithSidebar() {
  return (
    <CopilotChatConfigurationProvider agentId={AGENT_ID}>
      <div style={{ display: "flex", height: "100%" }}>
        <CopilotThreadsDrawer />
        <main style={{ flex: 1 }}>
          <YourMainContent />
          <CopilotSidebar defaultOpen={true} />
        </main>
      </div>
    </CopilotChatConfigurationProvider>
  );
}
//#endregion

//#region new-conversation-button
function NewConversationButton() {
  const configuration = useCopilotChatConfiguration();

  return (
    <button
      type="button"
      onClick={() => configuration?.startNewThread()}
    >
      New conversation
    </button>
  );
}

function DrawerWithOwnButton() {
  return (
    <CopilotChatConfigurationProvider agentId={AGENT_ID}>
      <div style={{ display: "flex", height: "100%" }}>
        <CopilotThreadsDrawer />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <header>
            <NewConversationButton />
          </header>
          <CopilotChat />
        </main>
      </div>
    </CopilotChatConfigurationProvider>
  );
}
//#endregion

//#region hide-drawer-new-thread-css
const HIDE_DRAWER_NEW_THREAD_CSS = `
copilotkit-threads-drawer::part(new-thread-button),
copilotkit-threads-drawer::part(launcher-new-thread) {
  display: none;
}
`;
//#endregion

//#region controlled
function ControlledChat() {
  const [threadId, setThreadId] = useState(() => crypto.randomUUID());
  const startNew = () => setThreadId(crypto.randomUUID());

  return (
    <CopilotChatConfigurationProvider threadId={threadId} agentId={AGENT_ID}>
      <CopilotThreadsDrawer
        onThreadSelect={(id) => setThreadId(id)}
        onNewThread={startNew}
      />
      <button type="button" onClick={startNew}>
        New conversation
      </button>
      <CopilotChat />
    </CopilotChatConfigurationProvider>
  );
}
//#endregion

export default function Page() {
  const [tab, setTab] = useState<TabId>("chat");
  const [hideDrawerNew, setHideDrawerNew] = useState(false);

  return (
    <DemoFrame
      parentPath="/prebuilt-components/copilot-threads-drawer"
      subtitle={`agent: ${AGENT_ID} · CopilotThreadsDrawer`}
    >
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2 text-xs dark:border-slate-800">
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
          {tab === "button" && (
            <label className="ml-auto flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={hideDrawerNew}
                onChange={(e) => setHideDrawerNew(e.target.checked)}
              />
              Hide the drawer&apos;s own new-conversation controls (page CSS)
            </label>
          )}
        </div>
        {tab === "button" && hideDrawerNew && (
          <style>{HIDE_DRAWER_NEW_THREAD_CSS}</style>
        )}
        {/* `key` remounts each tab so they don't share a configuration. */}
        <div key={tab} className="min-h-0 flex-1">
          {tab === "chat" && <DrawerWithChat />}
          {tab === "sidebar" && <DrawerWithSidebar />}
          {tab === "button" && <DrawerWithOwnButton />}
          {tab === "controlled" && <ControlledChat />}
        </div>
      </div>
    </DemoFrame>
  );
}
