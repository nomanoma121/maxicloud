import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { useFormContext, useWatch } from "react-hook-form";
import { Input, Textarea } from "~/components/ui/form-controls";
import { Field } from "./field";
import { ModeButton } from "./mode-button";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";

export const BuildSection = () => {
  const { register, setValue, control } = useFormContext<CreateApplicationInputValues>();
  const dockerfileSource = useWatch({ control, name: "dockerfileSource" });

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
          onClick={() => setValue("dockerfileSource", "path", { shouldDirty: true })}
        />
        <ModeButton
          active={dockerfileSource === "inline"}
          title="Inline Edit"
          description="Dockerfile本文を直接入力"
          onClick={() => setValue("dockerfileSource", "inline", { shouldDirty: true })}
        />
      </div>

      <div className={css({ display: "grid", gap: 2 })}>
        {dockerfileSource === "path" && (
          <Field label="Dockerfile Path">
            <Input {...register("dockerfilePath")} placeholder="deploy/Dockerfile" />
          </Field>
        )}

        {dockerfileSource === "inline" && (
          <Field label="Dockerfile Inline">
            <Textarea {...register("dockerfileInline")} rows={9} />
          </Field>
        )}
      </div>
    </section>
  );
};
