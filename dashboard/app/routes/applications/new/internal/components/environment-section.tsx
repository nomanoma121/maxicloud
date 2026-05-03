import { Code } from "react-feather";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";
import { Input, Textarea } from "~/components/ui/form-controls";
import type { SecretFormItem } from "../hooks/use-application-create-form";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";

type EnvironmentSectionProps = {
  envText: string;
  setEnvText: (value: string) => void;
  secrets: SecretFormItem[];
  addSecret: () => void;
  updateSecret: (id: string, field: "key" | "value", next: string) => void;
  removeSecret: (id: string) => void;
};

export const EnvironmentSection = ({
  envText,
  setEnvText,
  secrets,
  addSecret,
  updateSecret,
  removeSecret,
}: EnvironmentSectionProps) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Code size={15} />} title="5. Environment" description="環境変数の初期値を設定" />
      <Field label="Environment Variables">
        <Textarea value={envText} rows={6} onChange={(event) => setEnvText(event.target.value)} />
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
          <Button type="button" variant="secondary" size="sm" onClick={addSecret}>
            Add Secret
          </Button>
        </div>
        <div className={css({ display: "grid", gap: 2 })}>
          {secrets.map((secret) => (
            <div
              key={secret.id}
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
              <Input
                value={secret.key}
                onChange={(event) => updateSecret(secret.id, "key", event.target.value)}
                placeholder="SECRET_KEY"
              />
              <Input
                type="password"
                value={secret.value}
                onChange={(event) => updateSecret(secret.id, "value", event.target.value)}
                placeholder="secret value"
              />
              <Button type="button" variant="text" size="sm" onClick={() => removeSecret(secret.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
