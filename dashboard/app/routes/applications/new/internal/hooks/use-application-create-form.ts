import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useCreateApplicationMutation } from "~/hooks/use-maxicloud-mutation";
import {
  useAvailableDomainsQuery,
  useDomainAvailabilityQuery,
  useGitHubBranchesQuery,
  useGitHubRepositoriesQuery,
  useProjectsQuery,
} from "~/hooks/use-maxicloud-query";
import { useSession } from "~/hooks/use-session";

export type DockerfileSource = "path" | "inline";
export type ExposureMode = "public" | "private" | "idp";

export type SecretFormItem = {
  id: string;
  key: string;
  value: string;
};

const DEFAULT_DOCKERFILE = `FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]`;
const DEFAULT_BRANCH = "main";

const createFormItemId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `secret-${Date.now()}`;
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const parseKeyValueLines = (value: string): Record<string, string> => {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes("="))
    .reduce<Record<string, string>>((acc, line) => {
      const delimiter = line.indexOf("=");
      const key = line.slice(0, delimiter).trim();
      const val = line.slice(delimiter + 1).trim();
      if (key.length > 0) {
        acc[key] = val;
      }
      return acc;
    }, {});
};

const parseRepositoryFullName = (fullName: string) => {
  const [owner, name] = fullName.split("/", 2);
  return {
    owner: owner ?? "",
    name: name ?? "",
  };
};

const runtimeDefaultEnv = (runtime: string) => {
  if (runtime === "Go") return "PORT=8080\nGOMEMLIMIT=512MiB";
  if (runtime === "Python") return "PORT=8000\nPYTHONUNBUFFERED=1";
  return "NODE_ENV=production\nPORT=3000";
};

const parsePort = (value: string) => Number.parseInt(value, 10);

const isValidPort = (value: string) => {
  if (!/^\d+$/.test(value.trim())) return false;
  const port = parsePort(value);
  return port >= 1 && port <= 65535;
};

export const useApplicationCreateForm = () => {
  const { currentUser } = useSession();
  const { data: projects = [] } = useProjectsQuery();
  const { data: githubRepositories = [] } = useGitHubRepositoriesQuery();
  const { data: availableDomains = [] } = useAvailableDomainsQuery();
  const { mutateAsync: createApplication, isPending } = useCreateApplicationMutation();

  const [searchParams] = useSearchParams();
  const [projectId, setProjectId] = useState("");
  const [repositoryId, setRepositoryId] = useState("");
  const [branch, setBranch] = useState(DEFAULT_BRANCH);
  const [applicationName, setApplicationName] = useState("new-application");
  const [domainPrefix, setDomainPrefix] = useState("new-application");
  const [domainEdited, setDomainEdited] = useState(false);
  const [domainSuffix, setDomainSuffix] = useState("");
  const [exposureMode, setExposureMode] = useState<ExposureMode>("public");
  const [dockerfileSource, setDockerfileSource] = useState<DockerfileSource>("path");
  const [dockerfilePath, setDockerfilePath] = useState("Dockerfile");
  const [dockerfileInline, setDockerfileInline] = useState(DEFAULT_DOCKERFILE);
  const [port, setPort] = useState("3000");
  const [envText, setEnvText] = useState("NODE_ENV=production\nPORT=3000");
  const [checkedDomainKey, setCheckedDomainKey] = useState("");
  const [secrets, setSecrets] = useState<SecretFormItem[]>([
    { id: "secret-1", key: "", value: "" },
  ]);

  const repository = useMemo(
    () => githubRepositories.find((target) => target.id === repositoryId),
    [githubRepositories, repositoryId],
  );
  const trimmedDomainPrefix = domainPrefix.trim();
  const trimmedDomainSuffix = domainSuffix.trim();
  const currentDomainKey = `${trimmedDomainPrefix}:${trimmedDomainSuffix}`;
  const domainCheckable =
    exposureMode !== "private" &&
    trimmedDomainPrefix.length > 0 &&
    trimmedDomainSuffix.length > 0;

  const { data: branches = [] } = useGitHubBranchesQuery(repository?.fullName ?? "");
  const domainAvailabilityQuery = useDomainAvailabilityQuery({
    subdomain: trimmedDomainPrefix,
    rootDomain: trimmedDomainSuffix,
    enabled: false,
  });
  const isDomainAvailable =
    checkedDomainKey === currentDomainKey ? domainAvailabilityQuery.data : undefined;

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
    if (!repositoryId && githubRepositories[0]) {
      setRepositoryId(githubRepositories[0].id);
    }
  }, [githubRepositories, repositoryId]);

  useEffect(() => {
    if (!repository) return;
    setDockerfilePath(repository.dockerfilePaths[0] ?? "Dockerfile");
    setDockerfileSource("path");
    setEnvText(runtimeDefaultEnv(repository.detectedRuntime));
  }, [repository]);

  useEffect(() => {
    if (branches.includes(branch)) return;
    if (branches[0]) {
      setBranch(branches[0]);
      return;
    }
    if (repository?.defaultBranch) {
      setBranch(repository.defaultBranch);
      return;
    }
    setBranch(DEFAULT_BRANCH);
  }, [branch, branches, repository?.defaultBranch]);

  useEffect(() => {
    if (domainSuffix.length > 0) return;
    if (!availableDomains[0]) return;
    setDomainSuffix(availableDomains[0]);
  }, [availableDomains, domainSuffix]);

  useEffect(() => {
    if (domainCheckable) return;
    setCheckedDomainKey("");
  }, [domainCheckable]);

  const addSecret = () => {
    setSecrets((prev) => [
      ...prev,
      { id: createFormItemId(), key: "", value: "" },
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

  const checkDomainAvailability = async () => {
    if (!domainCheckable) {
      setCheckedDomainKey("");
      return undefined;
    }
    const res = await domainAvailabilityQuery.refetch();
    if (res.data === undefined) {
      return undefined;
    }
    setCheckedDomainKey(currentDomainKey);
    return res.data;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    if (!currentUser || !repository) return;
    if (exposureMode !== "private") {
      const available = await checkDomainAvailability();
      if (available !== true) {
        return;
      }
    }

    const parsedRepository = parseRepositoryFullName(repository.fullName);
    const parsedSecrets = secrets.reduce<Record<string, string>>((acc, secret) => {
      const key = secret.key.trim();
      if (!key) {
        return acc;
      }
      acc[key] = secret.value;
      return acc;
    }, {});

    await createApplication({
      projectId,
      ownerId: currentUser.id,
      name: applicationName,
      repositoryOwner: parsedRepository.owner,
      repositoryName: parsedRepository.name,
      branch,
      dockerfileSource,
      dockerfilePath,
      dockerfileInline,
      accessMode: exposureMode,
      domainSubdomain: exposureMode === "private" ? undefined : trimmedDomainPrefix,
      domainRootDomain: exposureMode === "private" ? undefined : trimmedDomainSuffix,
      port: parsePort(port),
      environmentVariables: parseKeyValueLines(envText),
      secrets: parsedSecrets,
    });
  };

  const canSubmit =
    Boolean(currentUser) &&
    projectId.trim().length > 0 &&
    applicationName.trim().length > 0 &&
    Boolean(repository) &&
    branch.trim().length > 0 &&
    isValidPort(port) &&
    (exposureMode === "private" ||
      (trimmedDomainPrefix.length > 0 &&
        trimmedDomainSuffix.length > 0));
  const portError = isValidPort(port)
    ? undefined
    : "Port must be an integer between 1 and 65535";

  return {
    projects,
    githubRepositories,
    availableDomains,
    repository,
    branches,
    isDomainAvailable,
    canSubmit,
    portError,
    isPending,
    projectId,
    setProjectId,
    repositoryId,
    setRepositoryId,
    branch,
    setBranch,
    applicationName,
    setApplicationName,
    domainPrefix,
    setDomainPrefix,
    setDomainEdited,
    domainSuffix,
    setDomainSuffix,
    checkDomainAvailability,
    exposureMode,
    setExposureMode,
    dockerfileSource,
    setDockerfileSource,
    dockerfilePath,
    setDockerfilePath,
    dockerfileInline,
    setDockerfileInline,
    port,
    setPort,
    envText,
    setEnvText,
    secrets,
    addSecret,
    updateSecret,
    removeSecret,
    submit,
  };
};

export type ApplicationCreateFormState = ReturnType<typeof useApplicationCreateForm>;
