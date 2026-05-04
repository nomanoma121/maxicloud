import { useMemo, useState } from "react";
import type { Application } from "~/types";
import { useApplicationsData } from "~/routes/applications/internal/hooks/use-applications-data";

export const useApplicationsListView = () => {
  const [keyword, setKeyword] = useState("");
  const { projectByID, applications, userByID } = useApplicationsData();

  const filteredApplications = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return applications;
    }

    return applications.filter((application) =>
      [application.name, application.repository, projectByID[application.projectId]?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [keyword, projectByID, applications]);

  return {
    keyword,
    setKeyword,
    filteredApplications,
    projectByID,
    userByID,
  };
};

export type ApplicationsListItem = Application;
