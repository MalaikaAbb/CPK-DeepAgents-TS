import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, CodeBlock, Panel, TryIt } from "@/components/ui";

// The page's "Adding metadata" sample. It is a fragment (an `onUpload`
// property, not a component) that calls `uploadToStorage` and reads
// `currentUser`, neither of which the page defines, so it is shown, not mounted.
const METADATA_FRAGMENT = `onUpload: async (file) => {
  const url = await uploadToStorage(file);
  return {
    type: "url",
    value: url,
    mimeType: file.type,
    metadata: {
      uploadedBy: currentUser.id,
      category: "support-ticket",
    },
  };
},`;

export default function Page() {
  return (
    <>
      <RouteHeader path="/multimodal-attachments" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          File attachments in <code>CopilotChat</code>: one{" "}
          <code>attachments</code> prop turns on the paperclip button and
          drag-and-drop, previews each file by modality, and sends it to the
          agent as an AG-UI <code>InputContent</code> part next to the text.
          The rest of the page is configuration: a MIME filter and size cap, a
          custom <code>onUpload</code> that returns inline data or a URL,
          upload concurrency, and two error hooks.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          The page is frontend-only, so every tab drives the Quickstart&apos;s{" "}
          <code>sample_agent</code> (the page&apos;s <code>my-agent</code> does
          not exist here). Tabs marked ✗ use helpers the page never defines and
          fail on upload by design.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Quick start tab: attach a PNG and ask 'What is in this image?'",
              "accept + maxSize tab: try attaching a .zip",
            ]}
            expect="The image shows as a thumbnail chip before sending, and the deep agent's reply describes it. In the accept + maxSize tab the .zip is refused before upload. The onUpload → data tab behaves like Quick start (same base64 payload, built by the page's handler)."
            fail="A RUN_ERROR after sending an image means the multimodal part did not survive the LangGraph adapter or the model rejected it; the onError tab logs it to the console as [code] message. On the ✗ tabs a failed upload is expected: /api/upload 404s, and uploadToStorage / toast throw ReferenceError."
          />
        </div>
      </Panel>

      <Callout tone="warn" title="Helpers the page uses and never defines">
        <ul className="space-y-1">
          <li>
            · <code>uploadToStorage(file)</code> — in the metadata and
            concurrency samples.
          </li>
          <li>
            · <code>currentUser</code> — in the metadata sample.
          </li>
          <li>
            · <code>toast</code> — in the <code>onUploadFailed</code> sample
            (no import shown).
          </li>
          <li>
            · <code>/api/upload</code> — the server route the URL sample POSTs
            to; no handler is published.
          </li>
        </ul>
        <p className="mt-2">
          None is filled in. The concurrency and <code>onUploadFailed</code>{" "}
          tabs keep the page&apos;s code with a <code>@ts-expect-error</code> on
          the undefined name, and the URL tab really POSTs to a route that
          does not exist. The metadata fragment is shown below rather than
          mounted.
        </p>
      </Callout>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/multimodal-attachments/demo-chat/page.tsx" />
      </Panel>

      <Panel title="Adding metadata (page fragment, not mounted)">
        <CodeBlock code={METADATA_FRAGMENT} language="tsx" />
      </Panel>
    </>
  );
}
