import { Box, PlusCircle } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import {
  ActionRow,
  BuildSection,
  EnvironmentSection,
  ExposeSection,
  GeneralSection,
  ProjectSection,
  SourceSection,
} from "./internal/components";
import { useApplicationCreateForm } from "./internal/hooks/use-application-create-form";

export const ApplicationCreateBuilder = () => {
  const {
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
  } = useApplicationCreateForm();

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Applications", href: APP_ROUTES.applications, icon: <Box size={14} /> },
          { label: "New", icon: <PlusCircle size={14} /> },
        ]}
      />

      <DashboardHeader
        title="New Application"
        subtitle="Projectを選んで、Applicationを作成します"
      />

      <div className={css({ display: "grid", gap: 4 })}>
        <Panel>
          <form className={css({ display: "grid", gap: 5 })} onSubmit={submit}>
            <ProjectSection
              projectId={projectId}
              setProjectId={setProjectId}
              projects={projects}
            />
            <GeneralSection
              applicationName={applicationName}
              setApplicationName={setApplicationName}
            />
            <SourceSection
              repositoryId={repositoryId}
              setRepositoryId={setRepositoryId}
              repository={repository}
              repositories={githubRepositories}
              branches={branches}
              branch={branch}
              setBranch={setBranch}
            />
            <BuildSection
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
              checkDomainAvailability={checkDomainAvailability}
              domainSuffixes={availableDomains}
              isDomainAvailable={isDomainAvailable}
              portError={portError}
            />
            <EnvironmentSection
              envText={envText}
              setEnvText={setEnvText}
              secrets={secrets}
              addSecret={addSecret}
              updateSecret={updateSecret}
              removeSecret={removeSecret}
            />
            <ActionRow isPending={isPending} canSubmit={canSubmit} />
          </form>
        </Panel>
      </div>
    </div>
  );
};
