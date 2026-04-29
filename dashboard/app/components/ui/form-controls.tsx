import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

type InputProps = ComponentProps<"input">;
type SelectProps = ComponentProps<"select">;
type TextareaProps = ComponentProps<"textarea">;

const baseControl = css({
  width: "100%",
  borderRadius: 6,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "gray.300",
  backgroundColor: "white",
  fontSize: "sm",
  outline: "none",
  transition: "border-color 0.2s ease",
  _focus: {
    borderColor: "green.600",
  },
});

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={cx(
        baseControl,
        css({
          padding: "token(spacing.2) token(spacing.3)",
        }),
        className,
      )}
    />
  );
};

export const Select = ({ className, ...props }: SelectProps) => {
  return (
    <select
      {...props}
      className={cx(
        baseControl,
        css({
          appearance: "none",
          padding: "token(spacing.2) token(spacing.9) token(spacing.2) token(spacing.3)",
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, token(colors.gray.500) 50%), linear-gradient(135deg, token(colors.gray.500) 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 16px) calc(50% - 2px), calc(100% - 11px) calc(50% - 2px)",
          backgroundSize: "5px 5px, 5px 5px",
          backgroundRepeat: "no-repeat",
        }),
        className,
      )}
    />
  );
};

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      {...props}
      className={cx(
        baseControl,
        css({
          padding: "token(spacing.2) token(spacing.3)",
          resize: "vertical",
          minHeight: "96px",
        }),
        className,
      )}
    />
  );
};
