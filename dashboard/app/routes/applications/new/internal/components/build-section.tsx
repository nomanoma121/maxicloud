import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { Input, Textarea } from "~/components/ui/form-controls";
import type { DockerfileSource } from "../hooks/use-application-create-form";
import { Field } from "./field";
import { ModeButton } from "./mode-button";
import { SectionHeading } from "./section-heading";

type BuildSectionProps = {
  dockerfileSource: DockerfileSource;
  setDockerfileSource: (value: DockerfileSource) => void;
  dockerfilePath: string;
  setDockerfilePath: (value: string) => void;
  dockerfileInline: string;
  setDockerfileInline: (value: string) => void;
};

export const BuildSection = ({
  dockerfileSource,
  setDockerfileSource,
  dockerfilePath,
  setDockerfilePath,
  dockerfileInline,
  setDockerfileInline,
}: BuildSectionProps) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Layers size={15} />} title="3. Build Strategy" description="Dockerfile と build 設定を指定" />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 2,
          mdDown: { gridTemplateColumns: "1fr" },
        })}
      >
        <ModeButton
          active={dockerfileSource === "path"}
          title="Specify Path"
          description="検知済みPathを基準に使う"
          onClick={() => setDockerfileSource("path")}
        />
        <ModeButton
          active={dockerfileSource === "inline"}
          title="Inline Edit"
          description="Dockerfile本文を直接入力"
          onClick={() => setDockerfileSource("inline")}
        />
      </div>

      <div className={css({ display: "grid", gap: 2 })}>
        {dockerfileSource === "path" && (
          <Field label="Dockerfile Path">
            <Input
              value={dockerfilePath}
              onChange={(event) => setDockerfilePath(event.target.value)}
              placeholder="deploy/Dockerfile"
            />
          </Field>
        )}

        {dockerfileSource === "inline" && (
          <Field label="Dockerfile Inline">
            <Textarea
              value={dockerfileInline}
              rows={9}
              onChange={(event) => setDockerfileInline(event.target.value)}
            />
          </Field>
        )}
      </div>
    </section>
  );
};
