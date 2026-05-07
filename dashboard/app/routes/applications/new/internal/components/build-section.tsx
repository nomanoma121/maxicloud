import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { useFormContext, useWatch } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { CREATE_APPLICATION_DOCKERFILE_SOURCE } from "~/constants";
import { ModeButton } from "./mode-button";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";

export const BuildSection = () => {
  const { register, setValue, control, formState: { errors } } = useFormContext<CreateApplicationInputValues>();
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
          active={dockerfileSource === CREATE_APPLICATION_DOCKERFILE_SOURCE.PATH}
          title="Specify Path"
          description="検知済みPathを基準に使う"
          onClick={() =>
            setValue("dockerfileSource", CREATE_APPLICATION_DOCKERFILE_SOURCE.PATH, { shouldDirty: true })
          }
        />
        <ModeButton
          active={dockerfileSource === CREATE_APPLICATION_DOCKERFILE_SOURCE.INLINE}
          title="Inline Edit"
          description="Dockerfile本文を直接入力"
          onClick={() =>
            setValue("dockerfileSource", CREATE_APPLICATION_DOCKERFILE_SOURCE.INLINE, { shouldDirty: true })
          }
        />
      </div>

      <div className={css({ display: "grid", gap: 2 })}>
        {dockerfileSource === CREATE_APPLICATION_DOCKERFILE_SOURCE.PATH && (
          <Form.Field.TextInput
            label="Dockerfile Path"
            error={errors.dockerfilePath?.message}
            placeholder="deploy/Dockerfile"
            {...register("dockerfilePath")}
          />
        )}

        {dockerfileSource === CREATE_APPLICATION_DOCKERFILE_SOURCE.INLINE && (
          <Form.Field.TextArea
            label="Dockerfile Inline"
            error={errors.dockerfileInline?.message}
            rows={9}
            {...register("dockerfileInline")}
          />
        )}
      </div>
    </section>
  );
};
