/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ADAPT THIS FILE — 3 of 3
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * One entry per doc page, in the order the doc nav lists them.
 *
 * Entries are deliberately short. `docUrl`, `demoUrl` and the output filename
 * are derived from `project.config.ts` plus the fields below, so no entry can
 * point at the wrong framework's docs and filenames stay in nav order without
 * anyone numbering them by hand.
 *
 * ── Where this list came from ──────────────────────────────────────────────
 * Generated from `frontend/src/lib/nav-config.ts`, which is this app's single
 * source of truth for route -> doc-page mapping. Every route carrying
 * `hasDemo: true` is registered here, in nav order; routes without a
 * `demo-chat` page are reference material and are deliberately absent, because
 * `demoUrl` is always `route + demoSuffix` and the doctor errors on any that
 * is not 200.
 *
 * Re-derive rather than hand-edit when the nav changes, then re-check the line
 * ranges below.
 *
 * ── The line ranges ────────────────────────────────────────────────────────
 * `startLine`/`endLine` are what the simulated IDE highlights, and they drift
 * the moment someone edits a demo page. `npm run doctor` checks each range
 * points at real code; where a file carries `[!code highlight]` or `#region`
 * markers it also checks the range still covers one.
 */

import { definePages } from '../core/types';

export const PAGES = definePages([
  {
    id: "quickstart",
    name: "Getting Started - Quickstart",
    videoName: "Quickstart",
    docPath: "quickstart",
    route: "quickstart",
    ideFile: "frontend/package.json",
    startLine: 11,
    endLine: 22,
    extraTabs: [
      { filePath: "frontend/src/app/quickstart/demo-chat/page.tsx", startLine: 22, endLine: 39 },
      { filePath: "frontend/src/app/api/copilotkit/route.ts", startLine: 1, endLine: 35 },
      { filePath: "backend/langgraph.json", startLine: 1, endLine: 20 },
    ],
    prompt: "Can you tell me a joke?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "generative-ui-tool-rendering",
    name: "Generative UI - Tool Rendering",
    videoName: "ToolRendering",
    docPath: "generative-ui/tool-rendering",
    route: "generative-ui/tool-rendering",
    ideFile: "frontend/src/app/generative-ui/tool-rendering/demo-chat/page.tsx",
    startLine: 14,
    endLine: 46,
    prompt: "What's the weather in Tokyo?",
    waitAfterPromptMs: 4000,
  },
  {
    id: "generative-ui-state-rendering",
    name: "Generative UI - State Rendering",
    videoName: "StateRendering",
    docPath: "generative-ui/state-rendering",
    route: "generative-ui/state-rendering",
    ideFile: "frontend/src/app/generative-ui/state-rendering/demo-chat/page.tsx",
    startLine: 9,
    endLine: 13,
    // `state_rendering_agent` streams a `searches` list, not a language. The
    // old "Switch to Spanish" got a polite reply and left the panel empty; a
    // research request is what makes the agent call report_research_progress
    // and the ⏳ -> ✅ list appear.
    prompt: "Research the best coffee shops in Tokyo",
    waitAfterPromptMs: 6000,
  },
  {
    id: "generative-ui-your-components-interrupt-based",
    name: "Generative UI - Interrupt-based HITL",
    videoName: "InterruptbasedHITL",
    docPath: "generative-ui/your-components/interrupt-based",
    route: "generative-ui/your-components/interrupt-based",
    ideFile: "frontend/src/app/generative-ui/your-components/interrupt-based/demo-chat/page.tsx",
    startLine: 11,
    endLine: 45,
    prompt: "Show the weather card for Tokyo: 77 degrees, clear",
    waitAfterPromptMs: 4000,
  },
  {
    id: "frontend-tools",
    name: "App Control - Frontend Tools",
    videoName: "FrontendTools",
    docPath: "frontend-tools",
    route: "frontend-tools",
    ideFile: "frontend/src/app/frontend-tools/demo-chat/page.tsx",
    startLine: 16,
    endLine: 20,
    // `sayHello` takes a required `name`. Without one in the prompt the agent
    // asks who to greet instead of calling the tool, and the run fails on the
    // dialog check that proves the handler ran in the browser.
    prompt: "Say hello to Ammar.",
    waitAfterPromptMs: 4000,
  },
  {
    id: "shared-state-in-app-agent-read",
    name: "Shared State - Reading agent state",
    videoName: "ReadingAgentState",
    docPath: "shared-state/in-app-agent-read",
    route: "shared-state/in-app-agent-read",
    ideFile: "frontend/src/app/shared-state/in-app-agent-read/demo-chat/page.tsx",
    startLine: 9,
    endLine: 13,
    // Two turns, because one proves nothing on its own. The first flips
    // `language` in agent state and the panel follows it; the second is a
    // neutral question, and the reply arriving in Spanish is the evidence that
    // the value the panel is showing is the one the agent is running on.
    prompt: "Switch to Spanish",
    prompts: [
      "Switch to Spanish",
      "What can you help me with?",
    ],
    waitAfterPromptMs: 4000,
  },
  {
    id: "shared-state-in-app-agent-write",
    name: "Shared State - Writing agent state",
    videoName: "WritingAgentState",
    docPath: "shared-state/in-app-agent-write",
    route: "shared-state/in-app-agent-write",
    ideFile: "frontend/src/app/shared-state/in-app-agent-write/demo-chat/page.tsx",
    startLine: 9,
    endLine: 13,
    prompt: "Switch to Spanish",
    waitAfterPromptMs: 4000,
  },
  {
    id: "shared-state-predictive-state-updates",
    name: "Shared State - Predictive State Updates",
    videoName: "PredictiveStateUpdates",
    docPath: "shared-state/predictive-state-updates?agent-type=prebuilt",
    route: "shared-state/predictive-state-updates",
    ideFile: "frontend/src/app/shared-state/predictive-state-updates/demo-chat/page.tsx",
    startLine: 31,
    endLine: 35,
    // One prompt per tab, in the order the demo lists them: prebuilt agent,
    // custom graph (manual emission), custom graph (tool emission). The page
    // is a three-way tab set and recording only the first covered a third of
    // it. Each asks for a multi-step task without implying a file system --
    // the prebuilt variant is a Deep Agent and will go looking for real files
    // if the task sounds like it involves any.
    prompt: "Plan a 4-step process for onboarding a new customer, reporting each step as you go.",
    prompts: [
      "Plan a 4-step process for onboarding a new customer, reporting each step as you go.",
      "Draft a launch announcement for our new pricing page.",
      "Plan a 4-step process for reviewing a support ticket backlog, reporting each step as you go.",
    ],
    waitAfterPromptMs: 5000,
  },
]);
