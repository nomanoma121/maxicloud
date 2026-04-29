import type { ComponentProps } from "react";
import { cva, cx } from "styled-system/css";

type Props = Omit<ComponentProps<"button">, "type"> & {
	type: "button" | "submit" | "reset";
	variant?: "primary" | "secondary" | "danger" | "text";
	disabled?: boolean;
	size?: "sm" | "md";
};

const buttonStyle = cva({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		borderRadius: 8,
		borderStyle: "solid",
		borderWidth: 1,
		fontWeight: 600,
		cursor: "pointer",
		transition: "all",
		textDecoration: "none",
		userSelect: "none",

		_disabled: {
			opacity: 0.5,
			cursor: "not-allowed",
			backgroundColor: "gray.200",
			borderColor: "gray.200",
			color: "gray.500",

			_hover: {
				backgroundColor: "gray.200",
				borderColor: "gray.200",
				color: "gray.500",
			},
		},
	},
	variants: {
		variant: {
			primary: {
				color: "white",
				backgroundColor: "green.600",
				borderColor: "green.500",
				"&:hover:not(:disabled)": {
					opacity: 0.9,
				},
			},
			secondary: {
				color: "gray.600",
				backgroundColor: "transparent",
				borderColor: "gray.400",
				"&:hover:not(:disabled)": {
					backgroundColor: "rgba(0, 0, 0, 0.05)",
					opacity: 0.9,
				},
			},
			danger: {
				color: "white",
				backgroundColor: "rose.600",
				borderColor: "rose.500",
				"&:hover:not(:disabled)": {
					opacity: 0.9,
				},
			},
			text: {
				color: "gray.700",
				backgroundColor: "transparent",
				borderColor: "transparent",
				"&:hover:not(:disabled)": {
					color: "green.600",
					backgroundColor: "green.600/5",
				},
			},
		},
		size: {
			sm: {
				padding: "token(spacing.1) token(spacing.2)",
				fontSize: "sm",
				minWidth: "80px",
			},
			md: {
				padding: "token(spacing.1) token(spacing.4)",
				fontSize: "md",
				minWidth: "120px",
			},
		},
	},
});

export const Button = ({
	type,
	variant = "primary",
	className,
	size = "md",
	...props
}: Props) => {
	return (
		<button
			{...props}
			type={type}
			className={cx(className, buttonStyle({ variant, size }))}
		/>
	);
};
