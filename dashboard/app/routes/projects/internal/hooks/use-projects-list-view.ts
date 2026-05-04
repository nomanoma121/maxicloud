import { useMemo, useState } from "react";
import type { Project } from "~/types";
import { useProjectsData } from "~/routes/projects/internal/hooks/use-projects-data";

export type ProjectCount = {
  total: number;
  healthy: number;
};

export type ProjectCountByID = Record<string, ProjectCount>;

export const useProjectsListView = () => {
  const [keyword, setKeyword] = useState("");
  const { projects, applications, userByID } = useProjectsData();

  const projectCountByID = useMemo(
    () =>
      Object.fromEntries(
        projects.map((project) => {
          const projectApplications = applications.filter(
            (application) => application.projectId === project.id,
          );
          const healthy = projectApplications.filter(
            (application) => application.status === "running",
          ).length;
          return [project.id, { total: projectApplications.length, healthy }] as const;
        }),
      ),
    [projects, applications],
  );

  const filteredProjects = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return projects;
    }

    return projects.filter((project) =>
      [project.name, project.description, userByID[project.ownerId]?.displayName ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [keyword, projects, userByID]);

  return {
    keyword,
    setKeyword,
    filteredProjects,
    projectCountByID,
    userByID,
  };
};

export type ProjectsListItem = Project;
