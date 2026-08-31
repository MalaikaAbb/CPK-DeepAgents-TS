import { PROJECT } from '../config/project.config';

/**
 * Pays the LangGraph dev server's one-off schema-inference cost up front,
 * instead of inside the first run against each graph.
 *
 * ── The failure this exists to stop ────────────────────────────────────────
 * The first run against a graph makes the Copilot Runtime fetch
 * `GET /assistants/{id}/schemas`, and the JS dev server answers that by
 * *inferring* the graph's state types. For the two hand-built `StateGraph`s on
 * the Predictive State Updates page — `Annotation.Root(...)`, no Zod schema —
 * that inference took **30 seconds**, measured, while the Deep Agents answer in
 * milliseconds because their state is already a Zod schema.
 *
 * The runtime holds the run POST open for the whole of it, so the recorder sees
 * a chat that accepted a prompt and produced nothing, and
 * `waitForAgentResponseCompletion` fails at its 30s start budget. It looked
 * exactly like a broken graph and was not: the backend log shows the run
 * starting the moment the schema call returned and succeeding in 4s. It is also
 * self-healing between runs, which is the confusing part — the tab that failed
 * on one recording passed on the next, and the *next* cold graph failed
 * instead.
 *
 * ── Why here rather than in page-ready.ts ──────────────────────────────────
 * `waitForPageReady` is deliberately framework-agnostic and is meant to be
 * promoted into the frozen `core/`. `/assistants/search` and
 * `/assistants/{id}/schemas` are LangGraph dev-server endpoints, so this stays
 * in the adaptation surface where framework-specific knowledge belongs. A
 * backend that answers neither is not an error: the warm-up is skipped and
 * pages run exactly as before.
 *
 * Started eagerly at import, so it overlaps the doc-page and IDE steps of the
 * first recording and usually costs nothing by the time a prompt is typed.
 */
let warming: Promise<void> | null = null;

async function warmOnce(): Promise<void> {
  const base = PROJECT.backendUrl?.replace(/\/$/, '');
  if (!base) return;

  const started = Date.now();

  const ids = await fetch(`${base}/assistants/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 100 }),
  })
    .then((res) => (res.ok ? res.json() : []))
    .then((rows: unknown) =>
      Array.isArray(rows)
        ? [
            ...new Set(
              rows
                .map((r) => (r as { graph_id?: unknown }).graph_id)
                .filter((id): id is string => typeof id === 'string' && id.length > 0),
            ),
          ]
        : [],
    )
    .catch(() => [] as string[]);

  if (ids.length === 0) return;

  // In parallel: the cost is per graph and independent, so the total is the
  // slowest one rather than their sum.
  await Promise.all(
    ids.map((id) =>
      fetch(`${base}/assistants/${encodeURIComponent(id)}/schemas`).catch(() => undefined),
    ),
  );

  const took = Date.now() - started;
  if (took > 3000) {
    console.log(
      `   ✓ agent schemas warmed in ${(took / 1000).toFixed(1)}s (${ids.length} graphs)`,
    );
  }
}

/** Resolves once every published graph has had its schema built. Never throws. */
export function warmAgentSchemas(): Promise<void> {
  warming ??= warmOnce().catch(() => undefined);
  return warming;
}

// Kick off at import so the wait is absorbed by the steps that come first.
void warmAgentSchemas();
