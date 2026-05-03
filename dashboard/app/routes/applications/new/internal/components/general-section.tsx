import { Box } from "react-feather";
import { css } from "styled-system/css";
import { Input } from "~/components/ui/form-controls";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";

type GeneralSectionProps = {
  applicationName: string;
  setApplicationName: (value: string) => void;
};

export const GeneralSection = ({
  applicationName,
  setApplicationName,
}: GeneralSectionProps) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Box size={15} />} title="1. General" description="サービス名を設定" />
      <div className={css({ display: "grid", gap: 2 })}>
        <Field label="Application Name">
          <Input value={applicationName} onChange={(event) => setApplicationName(event.target.value)} />
        </Field>
      </div>
    </section>
  );
};
