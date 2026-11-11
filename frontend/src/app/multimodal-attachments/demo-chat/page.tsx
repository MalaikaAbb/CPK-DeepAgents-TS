"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";
import { useState } from "react";

import { DemoFrame } from "@/components/demo-frame";

/**
 * Multimodal Attachments — every `<CopilotChat attachments={...}>` sample the
 * page prints, one tab each, all against `sample_agent` (the Quickstart deep
 * agent). The page's first sample says `agentId="my-agent"`; this runtime has
 * no such agent, so `agentId="sample_agent"` is passed in every tab (the page's
 * other samples pass none, and the root provider names no agent).
 *
 * Three tabs depend on helpers the page uses and never defines —
 * `uploadToStorage`, `toast`, and an `/api/upload` route. They are NOT filled
 * in: the code is the page's, with `@ts-expect-error` where TypeScript
 * rejects the undefined name, so those tabs fail at upload time exactly as a
 * reader's copy would. See README §9 (N2).
 */

const TABS = [
  { id: "quick", label: "Quick start" },
  { id: "config", label: "accept + maxSize" },
  { id: "data", label: "onUpload → data" },
  { id: "url", label: "onUpload → url (/api/upload) ✗" },
  { id: "concurrency", label: "maxConcurrentUploads ✗" },
  { id: "failed", label: "onUploadFailed (toast) ✗" },
  { id: "onerror", label: "onError" },
] as const;

type TabId = (typeof TABS)[number]["id"];

//#region quick-start
function QuickStart() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{ enabled: true }}
    />
  );
}
//#endregion

//#region configuration
function Configuration() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{
        enabled: true,
        // Omit `accept` to allow all file types (default: "*/*").
        // Restrict with a MIME filter if needed:
        accept: "image/*,audio/*,video/*,application/pdf",
        maxSize: 10 * 1024 * 1024,      // 10MB limit (default: 20MB)
      }}
    />
  );
}
//#endregion

//#region upload-data
function UploadData() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{
        enabled: true,
        onUpload: async (file) => {
          const buffer = await file.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          return {
            type: "data",
            value: base64,
            mimeType: file.type,
          };
        },
      }}
    />
  );
}
//#endregion

//#region upload-url
// The page's URL variant. It POSTs to `/api/upload`, a route the page never
// publishes; this harness has none either, so the upload fails (404 → JSON
// parse error) and onUpload throws — `upload-failed`.
function UploadUrl() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{
        enabled: true,
        onUpload: async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const { url } = await res.json();
          return {
            type: "url",
            value: url,
            mimeType: file.type,
          };
        },
      }}
    />
  );
}
//#endregion

//#region concurrency
function Concurrency() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{
        enabled: true,
        maxConcurrentUploads: 3, // three files at a time
        // @ts-expect-error -- `uploadToStorage` is used by the page and never defined (README §9 N2). Throws ReferenceError on upload.
        onUpload: async (file) => uploadToStorage(file),
      }}
    />
  );
}
//#endregion

//#region upload-failed
function UploadFailed() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{
        enabled: true,
        accept: "image/*",
        maxSize: 5 * 1024 * 1024, // 5MB
        onUploadFailed: (error) => {
          // error.reason: "file-too-large" | "invalid-type" | "upload-failed"
          // error.file: the original File object
          // error.message: human-readable description
          // @ts-expect-error -- `toast` is used by the page and never imported or defined (README §9 N2). Throws ReferenceError when a file is rejected.
          toast.error(error.message);
        },
      }}
    />
  );
}
//#endregion

//#region on-error
function OnError() {
  return (
    <CopilotChat
      agentId="sample_agent"
      attachments={{ enabled: true }}
      onError={(event) => {
        console.error(`[${event.code}]`, event.error.message);
      }}
    />
  );
}
//#endregion

export default function Page() {
  const [tab, setTab] = useState<TabId>("quick");

  return (
    <DemoFrame parentPath="/multimodal-attachments" subtitle="agent: sample_agent · CopilotChat attachments">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-slate-200 px-3 py-2 text-xs dark:border-slate-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded px-2 py-1 ${
                tab === t.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div key={tab} className="min-h-0 flex-1">
          {tab === "quick" && <QuickStart />}
          {tab === "config" && <Configuration />}
          {tab === "data" && <UploadData />}
          {tab === "url" && <UploadUrl />}
          {tab === "concurrency" && <Concurrency />}
          {tab === "failed" && <UploadFailed />}
          {tab === "onerror" && <OnError />}
        </div>
      </div>
    </DemoFrame>
  );
}
