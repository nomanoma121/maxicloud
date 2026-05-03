import { Code } from "react-feather";
import { css } from "styled-system/css";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input, Textarea } from "~/components/ui/form-controls";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";

const createFormItemId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `secret-${Date.now()}`;
};

export const EnvironmentSection = () => {
  const { register, control } = useFormContext<CreateApplicationInputValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "secrets" });

  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Code size={15} />} title="5. Environment" description="環境変数の初期値を設定" />
      <Field label="Environment Variables">
        <Textarea {...register("envText")} rows={6} />
      </Field>
      <div
        className={css({
          border: "1px solid",
          borderColor: "gray.200",
          borderRadius: "md",
          background: "white",
          padding: 3,
          display: "grid",
          gap: 2,
        })}
      >
        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 })}>
          <p className={css({ margin: 0, color: "gray.700", fontSize: "sm", fontWeight: 600 })}>Secrets</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ id: createFormItemId(), key: "", value: "" })}
          >
            Add Secret
          </Button>
        </div>
        <div className={css({ display: "grid", gap: 2 })}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 2,
                border: "1px solid",
                borderColor: "gray.200",
                borderRadius: "md",
                background: "white",
                padding: 2,
                mdDown: { gridTemplateColumns: "1fr" },
              })}
            >
              <input type="hidden" {...register(`secrets.${index}.id`)} />
              <Input {...register(`secrets.${index}.key`)} placeholder="SECRET_KEY" />
              <Input type="password" {...register(`secrets.${index}.value`)} placeholder="secret value" />
              <Button type="button" variant="text" size="sm" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
