"use client";

import { CopilotPopup } from "@copilotkit/react-core/v2";

import { DemoFrame } from "@/components/demo-frame";

/**
 * CopilotPopup — prebuilt component page.
 *
 * The rendered Deep Agents page publishes only the import line
 * (`import { CopilotKit, CopilotPopup } from "@copilotkit/react-core/v2"` plus the
 * v2 stylesheet); its usage example is a missing
 * `deepagents::...` snippet. NOT FROM THE DOC PAGE: the mount below is the
 * minimal one, `<CopilotPopup agentId="sample_agent" />`, using only `agentId` from the
 * page's props table so the component can be exercised. `CopilotKit` and the
 * stylesheet come from the app root.
 */
export default function Page() {
  return (
    <DemoFrame parentPath="/prebuilt-components/popup" subtitle="agent: sample_agent · CopilotPopup">
      <div className="relative h-full">
        <main className="flex h-full items-center justify-center p-8 text-center text-sm text-slate-500">
          Page content. The popup launcher floats in the corner.
        </main>
        <CopilotPopup agentId="sample_agent" />
      </div>
    </DemoFrame>
  );
}
