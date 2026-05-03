import type { ComponentProps } from "react";
import { ErrorDisplay } from "~/components/ui/form/error-display";
import { Input } from "~/components/ui/form/input";
import { WithLabelField } from "~/components/ui/form/field/with-label";

type Props = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  error?: string;
};

export const TextInputField = ({ label, error, required, ...props }: Props) => (
  <WithLabelField label={label} required={required}>
    {(id) => (
      <>
        <Input id={id} required={required} {...props} />
        <ErrorDisplay error={error} />
      </>
    )}
  </WithLabelField>
);
