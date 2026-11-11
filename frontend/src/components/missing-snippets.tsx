import { Callout } from "@/components/ui";

/**
 * The gap panel for doc pages whose rendered Deep Agents version prints
 * "Missing snippet — No demo found for deepagents::<id>" in place of code.
 *
 * The page's `.md` export still carries default (LangGraph / built-in-agent)
 * snippets for those cells, but the rendered `/deepagents/...` page shows
 * none of them, so there is no Deep Agents code to copy. Per AGENTS.md rule 2
 * nothing is filled in: the route lists exactly which cells are missing.
 */
export function MissingSnippets({
  ids,
  children,
}: {
  /** Demo cell ids as the rendered page prints them, e.g. "deepagents::voice". */
  ids: string[];
  children?: React.ReactNode;
}) {
  return (
    <Callout tone="warn" title="The rendered Deep Agents page publishes no code here">
      <p>
        Where this page&apos;s code samples should be, the live page renders a{" "}
        <strong>Missing snippet</strong> box (&ldquo;No demo found for …&rdquo;)
        for:
      </p>
      <ul className="mt-2 space-y-1">
        {ids.map((id) => (
          <li key={id}>
            · <code>{id}</code>
          </li>
        ))}
      </ul>
      <p className="mt-2">
        The page&apos;s <code>.md</code> export still carries another
        framework&apos;s default snippets for these cells; they are not Deep
        Agents code, so nothing was copied or written in their place.
      </p>
      {children && <div className="mt-2">{children}</div>}
    </Callout>
  );
}
