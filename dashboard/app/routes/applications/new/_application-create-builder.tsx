import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CheckCircle,
  Code,
  Folder,
  GitHub,
  Layers,
  PlusCircle,
  Sliders,
} from "react-feather";
import { useSearchParams } from "react-router";
import { css, cx } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Input, Select, Textarea } from "~/components/ui/form-controls";
import { useCreateApplicationMutation } from "~/hooks/use-maxicloud-mutation";
import {
  useGitHubRepositoriesQuery,
  useProjectsQuery,
} from "~/hooks/use-maxicloud-query";
import { useSession } from "~/hooks/use-session";
import { Panel } from "~/components/ui/panel";
import type { GitRepository } from "~/types";

type DockerfileSource = "path" | "inline";
type ExposureMode = "public" | "private" | "idp";

const DOMAIN_SUFFIXES = ["apps.maximum.vc", "internal.maximum.vc"];

const DEFAULT_DOCKERFILE = `FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]`;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const runtimeDefaultEnv = (runtime: string) => {
  if (runtime === "Go") return "PORT=8080\nGOMEMLIMIT=512MiB";
  if (runtime === "Python") return "PORT=8000\nPYTHONUNBUFFERED=1";
  return "NODE_ENV=production\nPORT=3000";
};

export const ApplicationCreateBuilder = () => {
  const { currentUser } = useSession();
  const { data: projects = [] } = useProjectsQuery();
  const { data: githubRepositories = [] } = useGitHubRepositoriesQuery();
  const { mutateAsync: createApplication, isPending } = useCreateApplicationMutation();

  const [searchParams] = useSearchParams();
  const [oauthState, setOauthState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [projectId, setProjectId] = useState("");
  const [repositoryId, setRepositoryId] = useState("");
  const [branch, setBranch] = useState("main");
  const [applicationName, setApplicationName] = useState("new-application");
  const [domainPrefix, setDomainPrefix] = useState("new-application");
  const [domainEdited, setDomainEdited] = useState(false);
  const [domainSuffix, setDomainSuffix] = useState(DOMAIN_SUFFIXES[0]);
  const [exposureMode, setExposureMode] = useState<ExposureMode>("public");
  const [dockerfileSource, setDockerfileSource] = useState<DockerfileSource>("path");
  const [dockerfilePath, setDockerfilePath] = useState("Dockerfile");
  const [dockerfileInline, setDockerfileInline] = useState(DEFAULT_DOCKERFILE);
  const [buildCommand, setBuildCommand] = useState("pnpm build");
  const [outputDirectory, setOutputDirectory] = useState("dist");
  const [port, setPort] = useState("3000");
  const [envText, setEnvText] = useState("NODE_ENV=production\nPORT=3000");
  const [secrets, setSecrets] = useState<Array<{ id: string; key: string; value: string }>>([
    { id: "secret-1", key: "", value: "" },
  ]);
  const githubConnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const repository = useMemo(
    () => githubRepositories.find((target) => target.id === repositoryId),
    [githubRepositories, repositoryId],
  );

  useEffect(() => {
    if (!projectId && projects[0]) {
      setProjectId(projects[0].id);
    }
  }, [projectId, projects]);

  useEffect(() => {
    const selected = searchParams.get("projectId");
    if (!selected) return;
    if (projects.some((project) => project.id === selected)) {
      setProjectId(selected);
    }
  }, [projects, searchParams]);

  useEffect(() => {
    if (!domainEdited) {
      const next = slugify(applicationName);
      setDomainPrefix(next || "new-application");
    }
  }, [domainEdited, applicationName]);

  useEffect(() => {
    if (oauthState !== "connected") return;
    if (!repositoryId && githubRepositories[0]) {
      setRepositoryId(githubRepositories[0].id);
    }
  }, [githubRepositories, oauthState, repositoryId]);

  useEffect(() => {
    if (!repository) return;
    setBranch(repository.defaultBranch);
    setBuildCommand(repository.buildCommand);
    setOutputDirectory(repository.outputDirectory);
    setDockerfilePath(repository.dockerfilePaths[0] ?? "Dockerfile");
    setDockerfileSource("path");
    setEnvText(runtimeDefaultEnv(repository.detectedRuntime));
  }, [repository]);

  const connectGithub = () => {
    setOauthState("connecting");
    if (githubConnectTimerRef.current) {
      clearTimeout(githubConnectTimerRef.current);
    }
    githubConnectTimerRef.current = setTimeout(() => {
      setOauthState("connected");
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (githubConnectTimerRef.current) {
        clearTimeout(githubConnectTimerRef.current);
      }
    };
  }, []);

  const addSecret = () => {
    setSecrets((prev) => [
      ...prev,
      { id: `secret-${Date.now()}-${prev.length}`, key: "", value: "" },
    ]);
  };

  const updateSecret = (id: string, field: "key" | "value", next: string) => {
    setSecrets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: next } : item)),
    );
  };

  const removeSecret = (id: string) => {
    setSecrets((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Applications", href: "/applications", icon: <Box size={14} /> },
          { label: "New", icon: <PlusCircle size={14} /> },
        ]}
      />

      <DashboardHeader
        title="New Application"
        subtitle="Projectを選んで、Applicationを作成します"
      />

      <div className={css({ display: "grid", gap: 4 })}>
        <Panel>
          <form
            className={css({ display: "grid", gap: 5 })}
            onSubmit={async (event) => {
              event.preventDefault();
              if (!currentUser || !repository) return;

              const exposure =
                exposureMode === "private"
                  ? `${applicationName}.internal.maximum.vc`
                  : `${domainPrefix}.${domainSuffix}`;

              await createApplication({
                projectId,
                ownerId: currentUser.id,
                name: applicationName,
                repository: repository.fullName,
                branch,
                runtime: repository.detectedRuntime,
                url: `https://${exposure}`,
                cpu: "0 / 1 vCPU",
                memory: "0Mi / 512Mi",
              });
            }}
          >
            <section className={css({ display: "grid", gap: 3 })}>
              <SectionHeading icon={<Folder size={15} />} title="0. Project" description="Applicationを追加するProject" />
              <Field label="Project">
                <Select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </Field>
            </section>
            <GeneralSection
              applicationName={applicationName}
              setApplicationName={setApplicationName}
            />
            <SourceSection
              oauthState={oauthState}
              connectGithub={connectGithub}
              repositoryId={repositoryId}
              setRepositoryId={setRepositoryId}
              repository={repository}
              repositories={githubRepositories}
              branch={branch}
              setBranch={setBranch}
            />
            <BuildSection
              buildCommand={buildCommand}
              setBuildCommand={setBuildCommand}
              outputDirectory={outputDirectory}
              setOutputDirectory={setOutputDirectory}
              dockerfileSource={dockerfileSource}
              setDockerfileSource={setDockerfileSource}
              dockerfilePath={dockerfilePath}
              setDockerfilePath={setDockerfilePath}
              dockerfileInline={dockerfileInline}
              setDockerfileInline={setDockerfileInline}
            />
            <ExposeSection
              exposureMode={exposureMode}
              setExposureMode={setExposureMode}
              port={port}
              setPort={setPort}
              domainPrefix={domainPrefix}
              setDomainPrefix={setDomainPrefix}
              setDomainEdited={setDomainEdited}
              domainSuffix={domainSuffix}
              setDomainSuffix={setDomainSuffix}
            />
            <EnvironmentSection
              envText={envText}
              setEnvText={setEnvText}
              secrets={secrets}
              addSecret={addSecret}
              updateSecret={updateSecret}
              removeSecret={removeSecret}
            />
            <ActionRow isPending={isPending} />
          </form>
        </Panel>
      </div>
    </div>
  );
};

const SourceSection = ({
  oauthState,
  connectGithub,
  repositoryId,
  setRepositoryId,
  repository,
  repositories,
  branch,
  setBranch,
}: {
  oauthState: "disconnected" | "connecting" | "connected";
  connectGithub: () => void;
  repositoryId: string;
  setRepositoryId: (value: string) => void;
  repository: GitRepository | undefined;
  repositories: GitRepository[];
  branch: string;
  setBranch: (value: string) => void;
}) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<GitHub size={15} />} title="2. Repository" description="GitHub Appで接続してソースを選択" />

      {oauthState !== "connected" ? (
        <div
          className={css({
            border: "1px solid",
            borderColor: "gray.200",
            borderRadius: "md",
            background: "white",
            padding: 4,
            display: "grid",
            gap: 3,
          })}
        >
          <p className={css({ margin: 0, color: "gray.600", fontSize: "sm" })}>
            GitHub OAuthで連携すると、アクセス可能なリポジトリ一覧とブランチを取得できます。
          </p>
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={connectGithub}
              disabled={oauthState === "connecting"}
            >
              {oauthState === "connecting" ? "Connecting..." : "Connect GitHub"}
            </Button>
          </div>
        </div>
      ) : (
        <div className={css({ display: "grid", gap: 3 })}>
          <Field label="Repository">
            <Select value={repositoryId} onChange={(event) => setRepositoryId(event.target.value)}>
              {repositories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.fullName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Branch">
            <Select value={branch} onChange={(event) => setBranch(event.target.value)}>
              {(repository?.branches ?? ["main"]).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Field>
          <div
            className={css({
              border: "1px solid",
              borderColor: "gray.200",
              borderRadius: "md",
              background: "white",
              padding: 3,
              display: "grid",
              gap: 1,
            })}
          >
            <p className={css({ margin: 0, color: "gray.700", fontSize: "sm", fontWeight: 600 })}>
              Auto detection result
            </p>
            <p className={css({ margin: 0, color: "gray.600", fontSize: "xs" })}>
              Runtime: {repository?.detectedRuntime ?? "-"}
            </p>
            <p className={css({ margin: 0, color: "gray.500", fontSize: "xs" })}>
              Files: {(repository?.detectedFiles ?? []).join(", ")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

const BuildSection = ({
  buildCommand,
  setBuildCommand,
  outputDirectory,
  setOutputDirectory,
  dockerfileSource,
  setDockerfileSource,
  dockerfilePath,
  setDockerfilePath,
  dockerfileInline,
  setDockerfileInline,
}: {
  buildCommand: string;
  setBuildCommand: (value: string) => void;
  outputDirectory: string;
  setOutputDirectory: (value: string) => void;
  dockerfileSource: DockerfileSource;
  setDockerfileSource: (value: DockerfileSource) => void;
  dockerfilePath: string;
  setDockerfilePath: (value: string) => void;
  dockerfileInline: string;
  setDockerfileInline: (value: string) => void;
}) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Layers size={15} />} title="3. Build Strategy" description="Dockerfile と build 設定を指定" />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 2,
          mdDown: { gridTemplateColumns: "1fr" },
        })}
      >
        <ModeButton
          active={dockerfileSource === "path"}
          title="Specify Path"
          description="検知済みPathを基準に使う"
          onClick={() => setDockerfileSource("path")}
        />
        <ModeButton
          active={dockerfileSource === "inline"}
          title="Inline Edit"
          description="Dockerfile本文を直接入力"
          onClick={() => setDockerfileSource("inline")}
        />
      </div>

      <div className={css({ display: "grid", gap: 2 })}>
        {dockerfileSource === "path" && (
          <Field label="Dockerfile Path">
            <Input value={dockerfilePath} onChange={(event) => setDockerfilePath(event.target.value)} placeholder="deploy/Dockerfile" />
          </Field>
        )}

        {dockerfileSource === "inline" && (
          <Field label="Dockerfile Inline">
            <Textarea value={dockerfileInline} rows={9} onChange={(event) => setDockerfileInline(event.target.value)} />
          </Field>
        )}

        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 2,
            mdDown: { gridTemplateColumns: "1fr" },
          })}
        >
          <Field label="Build Command">
            <Input value={buildCommand} onChange={(event) => setBuildCommand(event.target.value)} />
          </Field>
          <Field label="Output Directory">
            <Input value={outputDirectory} onChange={(event) => setOutputDirectory(event.target.value)} />
          </Field>
        </div>
      </div>
    </section>
  );
};

const GeneralSection = ({
  applicationName,
  setApplicationName,
}: {
  applicationName: string;
  setApplicationName: (value: string) => void;
}) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Box size={15} />} title="1. General" description="サービス名を設定" />
      <div
        className={css({
          display: "grid",
          gap: 2,
        })}
      >
        <Field label="Application Name">
          <Input value={applicationName} onChange={(event) => setApplicationName(event.target.value)} />
        </Field>
      </div>
    </section>
  );
};

const ExposeSection = ({
  exposureMode,
  setExposureMode,
  port,
  setPort,
  domainPrefix,
  setDomainPrefix,
  setDomainEdited,
  domainSuffix,
  setDomainSuffix,
}: {
  exposureMode: ExposureMode;
  setExposureMode: (value: ExposureMode) => void;
  port: string;
  setPort: (value: string) => void;
  domainPrefix: string;
  setDomainPrefix: (value: string) => void;
  setDomainEdited: (value: boolean) => void;
  domainSuffix: string;
  setDomainSuffix: (value: string) => void;
}) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Sliders size={15} />} title="4. Access" description="公開範囲と公開ポートを設定" />
      <Field label="Access">
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 2,
            mdDown: { gridTemplateColumns: "1fr" },
          })}
        >
          <ModeButton
            active={exposureMode === "public"}
            title="Public"
            description="誰でもアクセス可能"
            onClick={() => setExposureMode("public")}
          />
          <ModeButton
            active={exposureMode === "idp"}
            title="Members Only"
            description="IdP認証済み会員のみ許可"
            onClick={() => setExposureMode("idp")}
          />
          <ModeButton
            active={exposureMode === "private"}
            title="Private"
            description="外部公開しない"
            onClick={() => setExposureMode("private")}
          />
        </div>
      </Field>
      {exposureMode !== "private" && (
        <>
          <div
            className={css({
              display: "grid",
              gap: 2,
            })}
          >
            <p className={css({ margin: 0, color: "gray.600", fontSize: "sm", fontWeight: 600 })}>Domain Registration</p>
            <div
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mdDown: { gridTemplateColumns: "1fr" },
              })}
            >
              <Field
                label="Subdomain"
                labelClassName={css({ fontSize: "xs", color: "gray.500" })}
              >
                <Input
                  value={domainPrefix}
                  onChange={(event) => {
                    setDomainEdited(true);
                    setDomainPrefix(event.target.value);
                  }}
                />
              </Field>
              <Field
                label="Zone"
                labelClassName={css({ fontSize: "xs", color: "gray.500" })}
              >
                <Select value={domainSuffix} onChange={(event) => setDomainSuffix(event.target.value)}>
                  {DOMAIN_SUFFIXES.map((suffix) => (
                    <option key={suffix} value={suffix}>
                      {suffix}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
          <Field label="Expose Port">
            <Input value={port} onChange={(event) => setPort(event.target.value)} placeholder="3000" />
          </Field>
          <p className={css({ margin: 0, color: "gray.500", fontSize: "xs" })}>
            コンテナが待ち受けるポート番号を指定します（例: 3000）
          </p>
        </>
      )}
    </section>
  );
};

const EnvironmentSection = ({
  envText,
  setEnvText,
  secrets,
  addSecret,
  updateSecret,
  removeSecret,
}: {
  envText: string;
  setEnvText: (value: string) => void;
  secrets: Array<{ id: string; key: string; value: string }>;
  addSecret: () => void;
  updateSecret: (id: string, field: "key" | "value", next: string) => void;
  removeSecret: (id: string) => void;
}) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Code size={15} />} title="5. Environment" description="環境変数の初期値を設定" />
      <Field label="Environment Variables">
        <Textarea value={envText} rows={6} onChange={(event) => setEnvText(event.target.value)} />
      </Field>
      <div
        className={css({
          border: "1px solid",
          borderColor: "gray.200",
          borderRadius: "md",
          background: "white",
          padding: 3,
          display: "grid",
          gap: 2,
        })}
      >
        <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 })}>
          <p className={css({ margin: 0, color: "gray.700", fontSize: "sm", fontWeight: 600 })}>Secrets</p>
          <Button type="button" variant="secondary" size="sm" onClick={addSecret}>
            Add Secret
          </Button>
        </div>
        <div className={css({ display: "grid", gap: 2 })}>
          {secrets.map((secret) => (
            <div
              key={secret.id}
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: 2,
                border: "1px solid",
                borderColor: "gray.200",
                borderRadius: "md",
                background: "white",
                padding: 2,
                mdDown: { gridTemplateColumns: "1fr" },
              })}
            >
              <Input
                value={secret.key}
                onChange={(event) => updateSecret(secret.id, "key", event.target.value)}
                placeholder="SECRET_KEY"
              />
              <Input
                type="password"
                value={secret.value}
                onChange={(event) => updateSecret(secret.id, "value", event.target.value)}
                placeholder="secret value"
              />
              <Button type="button" variant="text" size="sm" onClick={() => removeSecret(secret.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ActionRow = ({ isPending }: { isPending: boolean }) => (
  <div
    className={css({
      borderTop: "1px solid",
      borderTopColor: "gray.100",
      paddingTop: 4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
      mdDown: { display: "grid" },
    })}
  >
    <p className={css({ margin: 0, color: "gray.500", fontSize: "sm" })}>
      設定は保存されます（API未接続のUIモック）
    </p>
    <Button type="submit" variant="primary" disabled={isPending}>
      {isPending ? "Creating..." : "Create Application"}
    </Button>
  </div>
);

const Field = ({
  label,
  children,
  labelClassName,
}: {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
}) => (
  <label className={css({ display: "grid", gap: 1 })}>
    <span
      className={cx(
        css({ fontSize: "sm", fontWeight: 600, color: "gray.600" }),
        labelClassName,
      )}
    >
      {label}
    </span>
    {children}
  </label>
);

const SectionHeading = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <header className={css({ display: "grid", gap: 1 })}>
    <p className={css({ margin: 0, color: "gray.800", fontWeight: 700, fontSize: "sm", display: "inline-flex", alignItems: "center", gap: 2 })}>
      {icon}
      {title}
    </p>
    <p className={css({ margin: 0, color: "gray.500", fontSize: "xs" })}>{description}</p>
  </header>
);

const ModeButton = ({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={css({
      border: "1px solid",
      borderColor: active ? "green.500" : "gray.200",
      borderRadius: "md",
      background: active ? "green.50" : "white",
      padding: 3,
      textAlign: "left",
      cursor: "pointer",
      display: "grid",
      gap: 1,
      _hover: {
        borderColor: "green.500",
      },
    })}
  >
    <span className={css({ fontSize: "sm", color: "gray.800", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 2 })}>
      {active && <CheckCircle size={14} />}
      {title}
    </span>
    <span className={css({ fontSize: "xs", color: "gray.500" })}>{description}</span>
  </button>
);
