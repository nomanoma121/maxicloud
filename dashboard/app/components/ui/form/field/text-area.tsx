import type { ComponentProps } from "react";
import { ErrorDisplay } from "~/components/ui/form/error-display";
import { Textarea } from "~/components/ui/form/textarea";
import { WithLabelField } from "~/components/ui/form/field/with-label";

type Props = Omit<ComponentProps<"textarea">, "id"> & {
  label: string;
  error?: string;
};

export const TextAreaField = ({ label, error, required, ...props }: Props) => (
  <WithLabelField label={label} required={required}>
    {(id) => (
      <>
        <Textarea id={id} required={required} {...props} />
        <ErrorDisplay error={error} />
      </>
    )}
  </WithLabelField>
);
