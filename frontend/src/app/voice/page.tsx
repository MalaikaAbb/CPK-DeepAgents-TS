import { MissingSnippets } from "@/components/missing-snippets";
import { RouteHeader } from "@/components/route-header";
import { Panel } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/voice" />

      <MissingSnippets
        ids={[
          "deepagents::voice (frontend page)",
          "deepagents::voice (sample-audio button)",
          "deepagents::voice (runtime route)",
          "deepagents::voice (transcription service)",
        ]}
      >
        <p>
          Every code cell on the rendered Deep Agents page is missing: the
          provider page, the sample-audio button, the dedicated{" "}
          <code>/api/copilotkit-voice/[[...slug]]</code> runtime route with a{" "}
          <code>transcriptionService</code>, and the transcription service
          factory. Reference-only, <strong>Broken</strong>. The{" "}
          <code>.md</code> fallback is the LangGraph showcase&apos;s code, which
          also imports an unpublished <code>@/lib/transcription-service</code>{" "}
          and a <code>VoiceChat</code> component it never shows.
        </p>
      </MissingSnippets>

      <Panel title="What the page describes">
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <code>CopilotChat</code> shows a mic button on its own once the
            runtime&apos;s <code>/info</code> reports{" "}
            <code>audioFileTranscriptionEnabled: true</code>; recorded audio is
            POSTed to the runtime&apos;s <code>/transcribe</code> endpoint and
            the transcript is sent like a typed message.
          </li>
          <li>
            The runtime gets that capability from a{" "}
            <code>transcriptionService</code> option on the v2{" "}
            <code>CopilotRuntime</code>. Without one, <code>/transcribe</code>{" "}
            answers <code>503 service_not_configured</code> and the mic never
            appears, so the symptom is silence rather than an error.
          </li>
          <li>
            For tests without a microphone, the page suggests a button that
            feeds a canned phrase into the composer instead of recording.
          </li>
        </ul>
      </Panel>

      <Panel title="Why this harness shows no mic today">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          The harness&apos;s runtime (<code>frontend/src/lib/intelligence-runtime.ts</code>)
          passes no <code>transcriptionService</code>, so its <code>/info</code>{" "}
          does not advertise transcription and no chat here renders a mic.
          Adding one would mean writing the service the page does not publish
          for Deep Agents.
        </p>
      </Panel>
    </>
  );
}
