import { GitHub } from "react-feather";
import { css } from "styled-system/css";
import { Select } from "~/components/ui/form-controls";
import type { GitRepository } from "~/types";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";

type SourceSectionProps = {
  repositoryId: string;
  setRepositoryId: (value: string) => void;
  repository: GitRepository | undefined;
  repositories: GitRepository[];
  branches: string[];
  branch: string;
  setBranch: (value: string) => void;
};

export const SourceSection = ({
  repositoryId,
  setRepositoryId,
  repository,
  repositories,
  branches,
  branch,
  setBranch,
}: SourceSectionProps) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading
        icon={<GitHub size={15} />}
        title="2. Repository"
        description="GitHub RepositoryとBranchを選択"
      />

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
            {(branches.length > 0 ? branches : ["main"]).map((value) => (
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
    </section>
  );
};
