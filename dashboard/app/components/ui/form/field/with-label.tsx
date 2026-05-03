import { useId } from "react";
import type { ReactNode } from "react";
import { css } from "styled-system/css";
import { FieldSet } from "~/components/ui/form/fieldset";
import { LabelText } from "~/components/ui/form/label-text";

type Props = {
  label: string;
  children: (id: string) => ReactNode;
  required?: boolean;
  labelClassName?: string;
};

export const WithLabelField = ({ label, children, required, labelClassName }: Props) => {
  const id = useId();
  return (
    <FieldSet>
      <label htmlFor={id}>
        <LabelText className={labelClassName}>
          {label}
          {required && (
            <span aria-hidden="true" className={css({ color: "rose.600", marginLeft: 0.5 })}>
              *
            </span>
          )}
        </LabelText>
      </label>
      {children(id)}
    </FieldSet>
  );
};
