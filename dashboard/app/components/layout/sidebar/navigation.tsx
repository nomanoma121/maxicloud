import type { Icon } from "react-feather";
import { Box, Folder, Home, Layers } from "react-feather";
import { NavLink, useLocation } from "react-router";
import { css } from "styled-system/css";
import { SidebarDot } from "./dot";

type SidebarNavigationProps = {
	onNavigate: () => void;
};

type NavigationItem = {
	to: string;
	label: string;
	icon: Icon;
	isActive: (pathname: string) => boolean;
};

const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		to: "/",
		label: "Overview",
		icon: Home,
		isActive: (pathname) => pathname === "/",
	},
	{
		to: "/projects",
		label: "Projects",
		icon: Folder,
		isActive: (pathname) => pathname.startsWith("/projects"),
	},
	{
		to: "/applications",
		label: "Applications",
		icon: Box,
		isActive: (pathname) => pathname.startsWith("/applications"),
	},
	{
		to: "/deployments",
		label: "Deployments",
		icon: Layers,
		isActive: (pathname) => pathname.startsWith("/deployments"),
	},
];

export const SidebarNavigation = ({ onNavigate }: SidebarNavigationProps) => {
	const { pathname } = useLocation();

	return (
		<nav>
			<ul
				className={css({
					display: "flex",
					flexDirection: "column",
					gap: 2,
					listStyle: "none",
					padding: 0,
					margin: 0,
				})}
			>
				{NAVIGATION_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = item.isActive(pathname);

					return (
						<li
							key={item.to}
							className={css({
								display: "flex",
								alignItems: "center",
								gap: 2,
							})}
						>
							<SidebarDot isActive={isActive} />
							<NavLink
								to={item.to}
								end={item.to === "/"}
								onClick={onNavigate}
								className={css({
									width: "100%",
									display: "inline-flex",
									alignItems: "center",
									gap: 2,
									textDecoration: "none",
									padding: "token(spacing.2) token(spacing.3)",
									borderRadius: "md",
									color: isActive ? "gray.700" : "gray.500",
									fontWeight: isActive ? 600 : 500,
									_hover: {
										color: "gray.700",
									},
								})}
							>
								<Icon size={15} />
								<span>{item.label}</span>
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
