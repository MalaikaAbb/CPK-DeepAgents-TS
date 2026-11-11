import { RouteHeader } from "@/components/route-header";
import { SourceCode } from "@/components/source-code";
import { Callout, Panel, TryIt } from "@/components/ui";

export default function Page() {
  return (
    <>
      <RouteHeader path="/custom-look-and-feel/markdown" />

      <Panel title="What it demonstrates">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Assistant replies are markdown rendered by the{" "}
          <code>markdownRenderer</code> slot (Streamdown by default). Three
          levels of control: a <code>components</code> map that swaps the
          React component for one HTML tag, a class string merged onto the
          whole block, or a replacement component that receives the raw{" "}
          <code>content</code> and takes over parsing and sanitising.
        </p>
        <div className="mt-4">
          <TryIt
            prompts={[
              "Reply with a level-2 heading 'Links' and a markdown link to https://copilotkit.ai",
            ]}
            expect="components map: the heading has an orange left bar and the link is orange and dotted-underlined, still opening in a new tab (target/rel survive the spread) and with no node='[object Object]' attribute. class string: the reply is smaller with taller line height. replace renderer: the raw markdown (## and [](...)) shows as preformatted text."
            fail="Default-styled heading and link in the first tab, or a literal node attribute in the DOM."
          />
        </div>
      </Panel>

      <Callout tone="info" title="Custom tags are rejected by design">
        The page also shows the compile error you get when adding a
        non-HTML key (e.g. <code>reference-chip</code>) to the{" "}
        <code>components</code> map, and explains that the renderer strips
        unknown tags at runtime. That is a negative example, so it is not
        mounted.
      </Callout>

      <Panel title="The demo's page">
        <SourceCode file="frontend/src/app/custom-look-and-feel/markdown/demo-chat/page.tsx" />
      </Panel>
    </>
  );
}
