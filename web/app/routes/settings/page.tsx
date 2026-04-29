import { Settings } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/form-controls";
import { useWorkspaceData } from "~/routes/settings/internal/hooks/use-workspace-data";
import { Panel } from "~/components/ui/panel";

export default function SettingsPage() {
  const { secrets, settings } = useWorkspaceData();

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Workspace", icon: <Settings size={14} /> },
        ]}
      />

      <DashboardHeader title="Workspace" subtitle="運用設定とシークレット管理" />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          lgDown: { gridTemplateColumns: "1fr" },
        })}
      >
        <Panel title="Workspace Settings">
          <div className={css({ display: "grid", gap: 3 })}>
            <SettingField label="Namespace" defaultValue={settings?.namespace ?? "maxicloud-prod"} />
            <SettingField label="Container Registry" defaultValue={settings?.registry ?? "ghcr.io/maximum"} />
            <Button type="button" variant="primary" size="sm">
              Save (Mock)
            </Button>
          </div>
        </Panel>

        <Panel title="Secrets">
          <div className={css({ display: "grid", gap: 2 })}>
            {secrets.map((secret) => (
              <div
                key={secret.key}
                className={css({
                  borderRadius: "md",
                  border: "1px solid",
                  borderColor: "gray.100",
                  background: "white",
                  padding: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 3,
                  alignItems: "center",
                })}
              >
                <code className={css({ color: "gray.600", fontSize: "xs" })}>{secret.key}</code>
                <Button type="button" variant="secondary" size="sm">
                  Rotate
                </Button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

const SettingField = ({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) => (
  <label className={css({ display: "grid", gap: 1 })}>
    <span className={css({ fontWeight: 600, fontSize: "sm" })}>{label}</span>
    <Input defaultValue={defaultValue} />
  </label>
);
