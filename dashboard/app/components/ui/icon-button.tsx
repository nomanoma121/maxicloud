import type { ComponentProps, JSX } from "react";
import { cva } from "styled-system/css";

export type Props = Omit<
	ComponentProps<"button">,
	"children" | "aria-label" | "type" | "className"
> & {
	type: "button" | "submit" | "reset";
	"aria-label": string;
	icon: JSX.Element;
	variant?: "primary" | "danger";
};

const _iconButtonStyleVariants = cva({
	base: {
		background: "none",
		border: "none",
		cursor: "pointer",
		padding: 2,
		borderRadius: "md",
		color: "gray.500",
		transition: "all",

		"&:hover": {
			backgroundColor: "gray.100",
		},

		"&:disabled": {
			cursor: "not-allowed",
			opacity: 0.5,
		},

		"&:focus-visible": {
			outline: "2px solid",
			outlineColor: "green.500",
		},
	},
	variants: {
		variant: {
			primary: {},
			danger: {
				"&:hover": {
					color: "red.500",
					backgroundColor: "red.500/10",
				},
			},
		},
	},
});

export const IconButton = ({ icon, variant = "primary", ...props }: Props) => (
	<button {...props} className={_iconButtonStyleVariants({ variant })}>
		{icon}
	</button>
);
