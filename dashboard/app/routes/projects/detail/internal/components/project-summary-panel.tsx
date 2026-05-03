import { Panel } from "~/components/ui/panel";
import { SummaryRow } from "~/routes/projects/detail/internal/components/summary-row";
import { css } from "styled-system/css";

type ProjectSummaryPanelProps = {
  ownerName: string;
  applicationCount: number;
  updatedAt: string;
};

export const ProjectSummaryPanel = ({
  ownerName,
  applicationCount,
  updatedAt,
}: ProjectSummaryPanelProps) => {
  return (
    <Panel title="Project Summary">
      <dl
        className={css({
          margin: 0,
          display: "grid",
          gap: 2,
        })}
      >
        <SummaryRow label="Owner" value={ownerName} />
        <SummaryRow label="Applications" value={String(applicationCount)} />
        <SummaryRow label="Updated" value={updatedAt} />
      </dl>
    </Panel>
  );
};
