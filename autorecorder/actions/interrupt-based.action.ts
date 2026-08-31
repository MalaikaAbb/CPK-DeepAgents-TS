import { type Page } from 'playwright';
import { humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';
import { promptsFor, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';

/**
 * Interrupt-based HITL, which no unattended handler can pass by typing alone.
 *
 * `interrupt_agent` raises a LangGraph `interrupt()` in its `beforeModel` hook,
 * so the *first* message is answered with a form asking for a name rather than
 * with a reply, and the run stays suspended until `resolve` is called. The
 * standard action sends its prompt and then waits for an assistant message that
 * cannot arrive: the graph is parked, waiting for the browser. It failed at the
 * 30s budget looking like a dead backend, which is the opposite of what is
 * happening — the interrupt working is the whole point of the page.
 *
 * So this handler answers it. Send the prompt, wait for the form the page's
 * `useInterrupt` renders, type a name, submit, and only then wait for the
 * reply — which is also the check that `resolve` really resumed the run.
 *
 * ── Two selector traps ─────────────────────────────────────────────────────
 * The interrupt form is `<input type="text" name="response">`, rendered inside
 * the message list. `SELECTORS.chatInput` matches `input[type="text"]` too, and
 * `.first()` takes DOM order, not selector order — so once the form is on
 * screen it is *earlier* in the document than the chat's own composer at the
 * bottom. Both controls are therefore addressed explicitly rather than through
 * the default.
 *
 * Only the "One interrupt" tab is driven. The second tab is the page's code as
 * printed and is expected to render nothing at all — see the route notes and
 * README §9 item 6 — so there is no interaction there to record.
 */
const INTERRUPT_INPUT = 'input[name="response"]';
const INTERRUPT_SUBMIT = 'button[type="submit"]:has-text("Submit")';
const CHAT_COMPOSER = 'textarea';

/** Name typed into the interrupt form. Appears in the resumed reply. */
const ANSWER = 'Ammar';

export const runInterruptBasedAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  const prompt = promptsFor(config)[0];

  console.log(`   [Interrupt HITL] Sending the prompt that trips the interrupt...`);
  const msgCount = await sendPrompt(page, prompt, {
    inputSelector: CHAT_COMPOSER,
    timeoutMs: 12000,
  });

  const field = page.locator(INTERRUPT_INPUT).first();
  await field.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {
    throw new Error(
      'The interrupt form never rendered: the agent answered normally, or the ' +
        'useInterrupt registration did not claim the event. Nothing was ' +
        'suspended, so there was nothing to resume.',
    );
  });

  console.log(`   [Interrupt HITL] Form rendered -- answering it with "${ANSWER}"...`);
  const fieldBox = await field.boundingBox();
  if (fieldBox) {
    await humanGlide(page, fieldBox.x + 60, fieldBox.y + fieldBox.height / 2, 20);
    await humanClick(page);
  } else {
    await field.click();
  }
  await sleep(300);
  await page.keyboard.type(ANSWER, { delay: 60 });
  await sleep(500);

  const submit = page.locator(INTERRUPT_SUBMIT).first();
  const submitBox = await submit.boundingBox().catch(() => null);
  if (submitBox) {
    await humanGlide(page, submitBox.x + submitBox.width / 2, submitBox.y + submitBox.height / 2, 18);
    await humanClick(page);
  } else {
    await page.keyboard.press('Enter');
  }

  // The reply only exists because `resolve` resumed the parked run, so waiting
  // for it is the assertion that the round trip completed.
  console.log(`   [Interrupt HITL] Resolved -- waiting for the resumed run to reply...`);
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);
};
