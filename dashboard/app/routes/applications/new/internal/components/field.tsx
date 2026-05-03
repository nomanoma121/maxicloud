import type { ReactNode } from "react";
import { Form } from "~/components/ui/form";

type FieldProps = {
  label: string;
  children: ReactNode;
  labelClassName?: string;
  required?: boolean;
};

export const Field = ({ label, children, labelClassName, required }: FieldProps) => (
  <Form.Field.WithLabel label={label} required={required} labelClassName={labelClassName}>
    {() => children}
  </Form.Field.WithLabel>
);
