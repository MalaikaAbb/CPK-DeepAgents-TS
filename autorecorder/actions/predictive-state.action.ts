import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

import { waitForPageReady } from './page-ready';

/**
 * Predictive State Updates, all three of the page's variants.
 *
 * The doc page is a three-way tab set — a prebuilt Deep Agent with
 * `stateStreamingMiddleware`, and two custom graphs reaching the same
 * `observed_steps` key by hand — and the demo mirrors it. Recording only the
 * default tab covered one of the three and, until the backend fix that ships
 * with this handler, it was the one that did not work: the panel stayed empty
 * while the two tabs nobody was recording filled correctly.
 *
 * So all three are driven, in nav order, each with its own turn. Every tab is a
 * separate graph and a separate chat, and the demo re-keys the pane on the
 * variant, so the chat is genuinely remounted between them — hence the
 * `waitForPageReady` after each click rather than a fixed sleep.
 */
const TABS = [
  { label: 'Prebuilt agent', match: 'button:has-text("Prebuilt agent")' },
  { label: 'Custom graph · manual', match: 'button:has-text("manual")' },
  { label: 'Custom graph · tool', match: 'button:has-text("tool")' },
] as const;

/** The `observed_steps` list in the left pane, plus its heading. */
const PROGRESS_PANEL = 'h1:has-text("Agent Progress")';

async function restOnProgressPanel(page: Page): Promise<void> {
  const heading = page.locator(PROGRESS_PANEL).first();
  const box = await heading.boundingBox().catch(() => null);
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height + 90, 22);
  } else {
    await humanGlide(page, 360, 260, 22);
  }
  await sleep(2000);
}

export const runPredictiveStateAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const prompts = promptsFor(config);

  for (let i = 0; i < TABS.length; i++) {
    const tab = TABS[i];

    if (i > 0) {
      console.log(`   [Predictive State] Switching to "${tab.label}"...`);
      const button = page.locator(tab.match).first();
      if (!(await button.isVisible({ timeout: 5000 }).catch(() => false))) {
        throw new Error(
          `The "${tab.label}" tab is missing, so only ${i} of ${TABS.length} ` +
            'variants of this doc page were recorded.',
        );
      }

      const box = await button.boundingBox();
      if (box) {
        await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
        await humanClick(page);
      } else {
        await button.click();
      }

      // The pane is keyed on the variant, so this click unmounts one chat and
      // mounts another against a different graph.
      await waitForPageReady(page, { label: `${config.id}:${tab.label}` });
    }

    // Empty list first -- the fill only reads as a change if the start is shown.
    await restOnProgressPanel(page);

    const prompt = prompts[i] ?? prompts[0];
    console.log(`   [Predictive State] ${tab.label}: "${prompt}"`);
    const msgCount = await sendPrompt(page, prompt, { timeoutMs: 12000 });
    await waitForAgentResponseCompletion(
      page,
      config.waitAfterPromptMs ?? 4000,
      msgCount,
    );

    // Rest on the filled list: the steps are the result, not the prose reply.
    await restOnProgressPanel(page);
  }
};
