import { Box } from "react-feather";
import { css } from "styled-system/css";
import { useFormContext } from "react-hook-form";
import { Input } from "~/components/ui/form-controls";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";

export const GeneralSection = () => {
  const { register } = useFormContext<CreateApplicationInputValues>();

  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Box size={15} />} title="1. General" description="サービス名を設定" />
      <div className={css({ display: "grid", gap: 2 })}>
        <Field label="Application Name">
          <Input {...register("applicationName")} />
        </Field>
      </div>
    </section>
  );
};
