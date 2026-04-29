import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "react-feather";
import { Link } from "react-router";
import { css, cx } from "styled-system/css";

export type BreadcrumbItem = {
	label: string;
	href?: string;
	icon?: ReactNode;
};

type BreadcrumbProps = ComponentProps<"nav"> & {
	items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items, className, ...props }: BreadcrumbProps) => {
	return (
		<nav
			aria-label="Breadcrumb"
			className={cx(
				css({
					display: "flex",
					alignItems: "center",
					gap: 2,
					fontSize: "sm",
				}),
				className,
			)}
			{...props}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<div
						key={`${item.label}-${index}`}
						className={css({
							display: "flex",
							alignItems: "center",
							gap: 2,
						})}
					>
						{item.href && !isLast ? (
							<Link
								to={item.href}
								className={css({
									display: "flex",
									alignItems: "center",
									gap: 1,
									color: "gray.500",
									textDecoration: "none",
									padding: "token(spacing.1) token(spacing.2)",
									borderRadius: "md",
									transition: "all",

									_hover: {
										color: "green.600",
										backgroundColor: "green.600/5",
									},

									_focusVisible: {
										outline: "2px solid",
										outlineColor: "green.600",
									},
								})}
							>
								{item.icon}
								<span>{item.label}</span>
							</Link>
						) : (
							<span
								className={css({
									display: "flex",
									alignItems: "center",
									gap: 1,
									color: isLast ? "gray.700" : "gray.500",
									fontWeight: isLast ? "medium" : "normal",
									padding: "token(spacing.1) token(spacing.2)",
								})}
							>
								{item.icon}
								<span>{item.label}</span>
							</span>
						)}

						{!isLast && (
							<span
								className={css({
									color: "gray.500",
									display: "flex",
									alignItems: "center",
								})}
							>
								<ChevronRight size={14} />
							</span>
						)}
					</div>
				);
			})}
		</nav>
	);
};
