/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ADAPT THIS DIRECTORY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * What the recorder *does* on each demo page once it is open.
 *
 * The registry lives here rather than in `core/` on purpose: adding or removing
 * a page must never mean editing frozen code. A page with no entry falls back
 * to `runStandardAction` — type the prompt, submit, wait for the reply — which
 * is right for most pages. Write a handler only when a page needs more than
 * that: switching tabs, clicking an approval button, opening a panel.
 *
 * ── How this map was built ─────────────────────────────────────────────────
 * A specialised handler is wired only where this repo's demo page actually
 * contains the DOM that handler drives — the tab labels it clicks, the
 * placeholder it types into, the button it presses. Pages that look similar but
 * render differently are deliberately left on `runStandardAction` rather than
 * wired optimistically, because a handler pointed at the wrong DOM fails the
 * run. Unwired handler files are kept: they are the closest starting point when
 * one of those pages does need driving.
 *
 * Handlers should build on the helpers in `core/actions.ts`:
 *
 *   sendPrompt(page, prompt, opts)          types and submits, returns the
 *                                           assistant-message count from before
 *                                           submitting
 *   waitForAgentResponseCompletion(...)     waits for the reply to finish, and
 *                                           throws if none ever arrives
 *   promptsFor(config)                      the page's prompts[] , or [prompt]
 *
 * Pass that returned count into waitForAgentResponseCompletion on multi-turn
 * pages, or the previous turn's reply is mistaken for this one's.
 */

import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { runStandardAction } from '../core/actions';
import { type Page } from 'playwright';

import { waitForPageReady } from './page-ready';
import { warmAgentSchemas } from './warm-agent-schemas';

import {
  runSharedStateReadAction,
} from './shared-state.action';
import { runFrontendToolsAction } from './frontend-tools.action';
import { runInterruptBasedAction } from './interrupt-based.action';
import { runPredictiveStateAction } from './predictive-state.action';
import { runStateRenderingAction } from './state-rendering.action';
import { runToolRenderingAction } from './tool-rendering.action';

/** Keys are page ids from `config/pages.config.ts`. Doctor flags any orphans. */
export const ACTION_MAP: Record<string, PageActionHandler> = {
  "generative-ui-tool-rendering": runToolRenderingAction,
  "generative-ui-state-rendering": runStateRenderingAction,
  "generative-ui-your-components-interrupt-based": runInterruptBasedAction,
  "frontend-tools": runFrontendToolsAction,
  "shared-state-in-app-agent-read": runSharedStateReadAction,
  "shared-state-predictive-state-updates": runPredictiveStateAction,
};

export async function executePageAction(
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
): Promise<void> {
  // One gate for every page, including the ones that fall through to
  // runStandardAction. The engine waits for the route to respond and for
  // `chatReady` to be visible, but a dev server compiles client chunks lazily,
  // so markup can be on screen before anything is wired to it -- and a prompt
  // typed into an unhydrated input goes nowhere. Handlers that remount a chat
  // mid-run (tab switches) call waitForDomSettled again themselves.
  await waitForPageReady(page, { label: config.id });

  // The runtime builds a graph's schema on the first run against it, and for a
  // hand-built StateGraph that can take 30s -- longer than the response
  // detector waits, so the first page to touch a cold graph fails looking like
  // a dead backend. Started at import; awaited here so no prompt is typed
  // before it is paid.
  await warmAgentSchemas();

  const handler = ACTION_MAP[config.id] ?? runStandardAction;
  await handler(page, config, rootPath);
}
