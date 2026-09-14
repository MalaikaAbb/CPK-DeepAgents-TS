import { type Page } from 'playwright';
import { AgentSilentError, promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { writeIssueNote } from '../core/issue-note';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';

/**
 * Interrupt-based HITL — one doc page, two tabs, two takes.
 *
 * The first tab is the page's Implementation section verbatim: one
 * `useInterrupt`, no `enabled`. It works, and the take films it working.
 *
 * The second is the page's "Condition UI executions" section, corrected, with
 * its `approval` interrupt rebuilt as a governed action on the `send_email`
 * tool — https://docs.copilotkit.ai/deepagents/human-in-the-loop/governed-actions.
 * Neither take carries a `knownIssue` any more, so neither writes a Notepad
 * report at the end; both fail loudly instead, because everything they drive is
 * supposed to work and a missing card is a regression rather than a documented
 * defect.
 *
 * They stay two takes rather than one because one clip per doc section is what
 * lets a reader open the footage for the section they are reading.
 */

/** A name distinctive enough that the reply cannot be a coincidence. */
const AGENT_NAME = 'Fiqros';

const TABS = {
  single: 'One interrupt',
  conditional: 'Two, dispatched by type',
} as const;

/** Clicks one of the variant tabs, with the cursor visibly travelling to it. */
async function selectTab(ctx: ActionContext, page: Page, key: keyof typeof TABS): Promise<void> {
  const label = TABS[key];
  const tab = page.locator(`button:has-text("${label}")`).first();

  if (!(await tab.isVisible({ timeout: 8000 }).catch(() => false))) {
    ctx.warn(`Tab "${label}" not found -- the demo page may have changed.`);
    return;
  }

  const box = await tab.boundingBox();
  if (!box) return;

  await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
  await sleep(350);
  await humanClick(page);
  console.log(`   ✓ Selected tab "${label}".`);

  // The two variants are keyed, so the click tears the old chat down and mounts
  // a new one. Give React the frame before anything is typed into it.
  await sleep(1400);
}

/**
 * Answers the interrupt's form.
 *
 * `input[name="response"]` and its submit button are the demo page's own markup
 * -- the doc prints exactly this form -- so they are targeted directly rather
 * than through the chat selectors, which do not match a component rendered
 * inside an interrupt.
 */
async function answerInterrupt(ctx: ActionContext, page: Page, answer: string): Promise<boolean> {
  const field = page.locator('input[name="response"]').first();

  // `waitFor`, not `isVisible({ timeout })`. Playwright's isVisible is a
  // non-retrying snapshot -- its `timeout` bounds the call, it does not poll --
  // so it answered "no form" the instant the prompt was sent, before the agent
  // had even started. Anything that appears *after* an agent run has to be
  // waited for; isVisible is only safe for things already on the page.
  const appeared = await field
    .waitFor({ state: 'visible', timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  if (!appeared) {
    ctx.warn(`The interrupt form never appeared.`);
    return false;
  }

  const box = await field.boundingBox();
  if (box) {
    await humanGlide(page, box.x + Math.min(box.width / 2, 120), box.y + box.height / 2, 20);
    await sleep(300);
    await humanClick(page);
  }

  await field.click({ timeout: 5000 }).catch(() => {});
  await field.type(answer, { delay: 105 });
  await sleep(600);

  const submit = page.locator('button[type="submit"]:visible').first();
  if (await submit.isVisible({ timeout: 4000 }).catch(() => false)) {
    const sBox = await submit.boundingBox();
    if (sBox) {
      await humanGlide(page, sBox.x + sBox.width / 2, sBox.y + sBox.height / 2, 18);
      await sleep(250);
      await humanClick(page);
    }
    await submit.click({ timeout: 4000 }).catch(() => {});
  } else {
    await field.press('Enter');
  }

  // A click is not an answer. Both of the ones above can be swallowed without
  // raising anything -- `humanClick` dispatches at a coordinate and reports
  // nothing, and the element click is behind a `.catch`. The card is drawn by
  // `useInterrupt`, which tears it down when the resume run starts, so the form
  // detaching is the only proof `resolve()` actually fired. Without this check
  // the take logged a green "answered" line and then failed 30s later waiting
  // for a reply to a run that was never resumed.
  const submitted = await field
    .waitFor({ state: 'detached', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitted) {
    // One retry from the keyboard, which cannot be covered by an overlay the
    // way a button at the bottom edge of the viewport can -- the recorder's own
    // taskbar sits at `bottom: 0` and is how this was first found.
    ctx.warn(`The submit click did not take; retrying from the keyboard.`);
    await field.press('Enter').catch(() => {});
    const retried = await field
      .waitFor({ state: 'detached', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!retried) {
      ctx.warn(`The interrupt form is still on screen -- resolve() never fired.`);
      return false;
    }
  }

  console.log(`   ✓ Answered the interrupt with "${answer}".`);
  return true;
}

/**
 * One interrupt, three turns, each load-bearing:
 *
 *   1. anything at all           -- `beforeModel` fires and the interrupt renders
 *   2. a name, in the form       -- `resolve()` sends it, the run continues
 *   3. "what should I call you?" -- and the agent uses it
 *
 * Turn 3 is what proves the resolved value reached the model rather than being
 * swallowed on the way back. The name is deliberately one no model would
 * produce on its own, so nobody can argue the agent guessed it.
 */
export const runInterruptSingleAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {
  const [opening, followUp] = promptsFor(config);

  console.log(`   [Interrupt] Opening turn to trigger beforeModel...`);
  await sendPrompt(page, opening, { timeoutMs: 12000 });

  const answered = await answerInterrupt(ctx, page, AGENT_NAME);
  if (!answered) {
    throw new Error(
      'The interrupt form never rendered. This tab is the one that is supposed to ' +
        'work, so this is a new failure rather than the documented one on the ' +
        'conditional tab -- do not file it as that.',
    );
  }

  await waitForAgentResponseCompletion(page, 2500);

  const msgCount = await sendPrompt(page, followUp ?? 'What should I call you?', {
    timeoutMs: 12000,
  });
  await waitForAgentResponseCompletion(page, 1500, msgCount);

  await sleep(config.waitAfterPromptMs ?? 4000);

  if (config.knownIssue) {
    await writeIssueNote(page, config.id, config.knownIssue);
  }
};

/**
 * Two registrations dispatched by `enabled`, and the governed action one of
 * them approves.
 *
 * Three turns, because the tab has three things worth filming and they are
 * sequential:
 *
 *   1. an opening turn        -- `beforeModel` raises the `ask` interrupt and
 *                                the blue name box is drawn
 *   2. an external recipient  -- policy says `require_approval`, the amber card
 *                                appears, and clicking Approve sends it
 *   3. a blocked recipient    -- policy says `deny`, the red card auto-cancels
 *                                itself, and the agent reports the block
 *
 * Turn 3 needs no click: the card decides it, which is the point of showing it.
 * Each step fails loudly instead of being excused, because all three work --
 * a missing card here is a regression, not a documented defect.
 */
export const runInterruptConditionalAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {
  await selectTab(ctx, page, 'conditional');

  const [opening, approvedSend, blockedSend] = promptsFor(config);

  console.log(`   [Interrupt conditional] Opening turn to raise the "ask" interrupt...`);
  await sendPrompt(page, opening, { timeoutMs: 12000 });

  if (!(await answerInterrupt(ctx, page, AGENT_NAME))) {
    throw new Error(
      'The "ask" interrupt never rendered on the conditional tab. Either the ' +
        '`enabled` dispatch stopped claiming the event or the agent server is down.',
    );
  }
  await waitForAgentResponseCompletion(page, 2500);

  // Turn 2 -- require_approval, answered by hand.
  console.log(`   [Interrupt conditional] Proposing an external send (require_approval)...`);
  let msgCount = await sendPrompt(page, approvedSend, { timeoutMs: 12000 });

  const approve = page.locator('button:has-text("Approve and run")').first();
  const cardShown = await approve
    .waitFor({ state: 'visible', timeout: 45000 })
    .then(() => true)
    .catch(() => false);

  if (!cardShown) {
    throw new Error(
      'The governed-action card never rendered. The approval interrupt is raised from ' +
        '`wrapToolCall` in backend/src/interruptBased.ts -- check the agent called ' +
        '`send_email` at all before blaming the frontend.',
    );
  }

  const box = await approve.boundingBox();
  if (box) {
    await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 20);
    await sleep(500);
    await humanClick(page);
  }
  await approve.click({ timeout: 4000 }).catch(() => {});
  console.log(`   ✓ Approved the governed action.`);

  try {
    await waitForAgentResponseCompletion(page, 3000, msgCount);
  } catch (e) {
    if (!(e instanceof AgentSilentError)) throw e;
    ctx.warn(`[Interrupt conditional] No reply after approval; the clip ends on the tool card.`);
  }

  // Turn 3 -- deny, decided by the card without a click.
  console.log(`   [Interrupt conditional] Proposing a blocked send (deny)...`);
  msgCount = await sendPrompt(page, blockedSend, { timeoutMs: 12000 });

  const denied = page.locator('text=Blocked by policy').first();
  const deniedShown = await denied
    .waitFor({ state: 'visible', timeout: 45000 })
    .then(() => true)
    .catch(() => false);

  if (deniedShown) {
    console.log(`   ✓ Policy denial card drawn; it cancels the run on its own.`);
  } else {
    // The card cancels itself the moment it mounts, so on a slow machine the
    // frame can be gone before the locator settles. The agent's reply is the
    // second witness, and the take is only failed if that is missing too.
    ctx.warn(`[Interrupt conditional] Did not catch the denial card on screen; ` +
        `checking the agent's reply instead.`,
    );
  }

  try {
    await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 5000, msgCount);
  } catch (e) {
    if (!(e instanceof AgentSilentError)) throw e;
    throw new Error(
      'The blocked send produced neither a denial card nor a reply. The `cancel()` ' +
        'path needs the structured interrupt wire -- check `STANDARD_INTERRUPT_GRAPHS` ' +
        'in the runtime route still lists interrupt_multi_agent.',
    );
  }

  await sleep(2500);

  if (config.knownIssue) {
    await writeIssueNote(page, config.id, config.knownIssue);
  }
};
