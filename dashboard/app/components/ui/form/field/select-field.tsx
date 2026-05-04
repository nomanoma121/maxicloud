import type { ComponentProps } from "react";
import { ErrorDisplay } from "~/components/ui/form/error-display";
import { Select } from "~/components/ui/form/select";
import { WithLabelField } from "~/components/ui/form/field/with-label";

type Props = Omit<ComponentProps<"select">, "id"> & {
  label: string;
  error?: string;
};

export const SelectField = ({ label, error, required, children, ...props }: Props) => (
  <WithLabelField label={label} required={required}>
    {(id) => (
      <>
        <Select id={id} required={required} {...props}>
          {children}
        </Select>
        <ErrorDisplay error={error} />
      </>
    )}
  </WithLabelField>
);
