import { Folder } from "react-feather";
import { Outlet } from "react-router";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";

export default function ProjectsLayout() {
	return (
		<div className={css({ display: "grid", gap: 4 })}>
			<Breadcrumb
				items={[
					{ label: "Dashboard", href: "/" },
					{
						label: "Projects",
						href: "/projects",
						icon: <Folder size={14} />,
					},
				]}
			/>
			<DashboardHeader
				title="Projects"
				subtitle="ProjectごとにApplicationをまとめて管理します"
			/>
			<Outlet />
		</div>
	);
}
