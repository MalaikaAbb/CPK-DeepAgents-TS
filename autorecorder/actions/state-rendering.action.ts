import { type Page } from 'playwright';
import { humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

/**
 * State Rendering, where the thing worth filming is not the reply.
 *
 * `report_research_progress` writes a `searches` array and
 * `stateStreamingMiddleware` mirrors it into `agent.state` as the model is
 * still writing the argument, so the left pane fills task by task while the
 * chat is mid-answer and each ⏳ flips to ✅ on the closing call. All of that
 * happens *beside* the message column.
 *
 * The standard action ends by gliding onto the finished assistant message,
 * which is the wrong half of the screen for this page: the cursor lands on
 * prose while the panel the route exists to demonstrate sits unattended. This
 * one shows the empty panel first, sends the prompt, and returns to the panel
 * afterwards so the before/after is legible.
 */
const SEARCHES_PANEL = 'h1:has-text("Research progress")';

async function restOnSearchesPanel(page: Page): Promise<void> {
  const heading = page.locator(SEARCHES_PANEL).first();
  const box = await heading.boundingBox().catch(() => null);
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height + 80, 22);
  } else {
    await humanGlide(page, 360, 220, 22);
  }
  await sleep(2000);
}

export const runStateRenderingAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  console.log(`   [State Rendering] Showing the empty searches panel...`);
  await restOnSearchesPanel(page);

  console.log(`   [State Rendering] Prompting -- the panel fills as it answers...`);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 12000 });
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);

  console.log(`   [State Rendering] Resting on the completed task list...`);
  await restOnSearchesPanel(page);
};
