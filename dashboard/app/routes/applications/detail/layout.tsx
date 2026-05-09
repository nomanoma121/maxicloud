import { Box } from "react-feather";
import { Outlet, useParams } from "react-router";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import type { Application } from "~/repository/application";
import { ApplicationNotFoundState } from "~/routes/applications/detail/internal/components/not-found-state";
import { useApplicationDetailData } from "~/routes/applications/internal/hooks/use-applications-data";

type BaseDetail = ReturnType<typeof useApplicationDetailData>;

export type ApplicationDetailContext = Omit<BaseDetail, "application"> & {
	application: Application;
	applicationId: string;
};

export default function ApplicationDetailLayout() {
	const { applicationId = "" } = useParams();
	const detail = useApplicationDetailData(applicationId);

	if (!detail.application) {
		return <ApplicationNotFoundState />;
	}

	return (
		<div className={css({ display: "grid", gap: 4 })}>
			<Breadcrumb
				items={[
					{ label: "Dashboard", href: "/" },
					{
						label: "Applications",
						href: "/applications",
						icon: <Box size={14} />,
					},
					{ label: detail.application.name },
				]}
			/>

			<DashboardHeader
				title={detail.application.name}
				subtitle={`${detail.application.repository} (${detail.application.branch})`}
			/>

			<Outlet context={{ ...detail, applicationId }} />
		</div>
	);
}
