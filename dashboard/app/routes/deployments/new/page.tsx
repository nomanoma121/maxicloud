import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Compass, Layers } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Input, Select, Textarea } from "~/components/ui/form-controls";
import { useCreateDeploymentMutation } from "~/hooks/use-maxicloud-mutation";
import { useServicesQuery } from "~/hooks/use-maxicloud-query";
import { useSession } from "~/hooks/use-session";
import { Panel } from "~/components/ui/panel";

export default function NewDeploymentPage() {
  const navigate = useNavigate();
  const { currentUser } = useSession();
  const { data: services = [] } = useServicesQuery();
  const { mutateAsync: createDeployment, isPending } = useCreateDeploymentMutation();

  const [serviceId, setServiceId] = useState("");
  const [branch, setBranch] = useState("main");
  const [revision, setRevision] = useState("HEAD");
  const [strategy, setStrategy] = useState("rolling");
  const [envText, setEnvText] = useState("LOG_LEVEL=info");

  useEffect(() => {
    if (!serviceId && services[0]) {
      setServiceId(services[0].id);
    }
  }, [serviceId, services]);

  const service = useMemo(
    () => services.find((target) => target.id === serviceId) ?? services[0],
    [serviceId, services],
  );

  useEffect(() => {
    if (!service) return;
    setBranch(service.branch);
  }, [service]);

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Deployments", href: "/deployments", icon: <Layers size={14} /> },
          { label: "New", icon: <Compass size={14} /> },
        ]}
      />

      <DashboardHeader
        title="New Deployment"
        subtitle="既存Serviceを選択して再デプロイ（処理は未接続）"
      />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1.25fr 1fr",
          gap: 4,
          lgDown: { gridTemplateColumns: "1fr" },
        })}
      >
        <Panel>
          <form
            className={css({ display: "grid", gap: 3 })}
            onSubmit={async (event) => {
              event.preventDefault();
              if (!currentUser || !service) return;

              await createDeployment({
                serviceId: service.id,
                ownerId: currentUser.id,
                revision,
                commit: `sha-${Math.random().toString(16).slice(2, 9)}`,
                strategy,
              });
            }}
          >
            <div
              className={css({
                border: "1px solid",
                borderColor: "gray.200",
                borderRadius: "md",
                background: "gray.50",
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mdDown: { display: "grid" },
              })}
            >
              <p className={css({ margin: 0, fontSize: "sm", color: "gray.600" })}>
                新規Serviceの作成は別フローです
              </p>
              <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/services/new")}>
                New Service
              </Button>
            </div>

            <Field label="Service">
              <Select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
                {services.map((serviceItem) => (
                  <option key={serviceItem.id} value={serviceItem.id}>
                    {serviceItem.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Branch">
              <Input value={branch} onChange={(event) => setBranch(event.target.value)} />
            </Field>
            <Field label="Revision (commit / tag)">
              <Input value={revision} onChange={(event) => setRevision(event.target.value)} />
            </Field>
            <Field label="Deploy Strategy">
              <Select value={strategy} onChange={(event) => setStrategy(event.target.value)}>
                <option value="rolling">Rolling</option>
                <option value="recreate">Recreate</option>
                <option value="canary">Canary</option>
              </Select>
            </Field>
            <Field label="Environment Overrides">
              <Textarea value={envText} onChange={(event) => setEnvText(event.target.value)} rows={5} />
            </Field>

            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Creating..." : "Create Deployment"}
            </Button>
          </form>
        </Panel>

        <Panel title="Review">
          <dl className={css({ margin: 0, display: "grid", gap: 2 })}>
            <Row label="Service" value={service?.name ?? "-"} />
            <Row label="Repository" value={service?.repository ?? "-"} />
            <Row label="Domain" value={service?.url ?? "-"} />
            <Row label="Branch" value={branch} />
            <Row label="Revision" value={revision} />
            <Row label="Strategy" value={strategy} />
            <Row label="Owner" value={currentUser?.displayName ?? "-"} />
          </dl>
          <p className={css({ marginTop: 3, marginBottom: 0, color: "gray.500", fontSize: "sm" })}>
            将来はこの画面で rollback point と pre-deploy checks を設定する想定です。
          </p>
        </Panel>
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className={css({ display: "grid", gap: 1 })}>
    <span className={css({ fontSize: "sm", fontWeight: 600, color: "gray.600" })}>{label}</span>
    {children}
  </label>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div
    className={css({
      display: "grid",
      gridTemplateColumns: "90px 1fr",
      gap: 2,
      borderBottom: "1px solid",
      borderBottomColor: "gray.100",
      paddingBottom: 2,
    })}
  >
    <dt className={css({ color: "gray.500", fontSize: "xs", textTransform: "uppercase" })}>{label}</dt>
    <dd className={css({ margin: 0, color: "gray.700", fontSize: "sm", overflowWrap: "anywhere" })}>{value}</dd>
  </div>
);
