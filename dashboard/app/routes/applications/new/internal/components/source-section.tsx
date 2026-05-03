import { useMemo } from "react";
import { GitHub } from "react-feather";
import { css } from "styled-system/css";
import { useFormContext, useWatch } from "react-hook-form";
import { Select } from "~/components/ui/form-controls";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";
import { useGitHubBranches, useGitHubRepositories } from "../hooks/use-source";

export const SourceSection = () => {
  const { register, control } = useFormContext<CreateApplicationInputValues>();
  const repositoryId = useWatch({ control, name: "repositoryId" });
  const { data: repositories = [] } = useGitHubRepositories();
  const repository = useMemo(
    () => repositories.find((target) => target.id === repositoryId),
    [repositories, repositoryId],
  );
  const { data: branches = [] } = useGitHubBranches(repository?.fullName ?? "");

  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading
        icon={<GitHub size={15} />}
        title="2. Repository"
        description="GitHub RepositoryとBranchを選択"
      />

      <div className={css({ display: "grid", gap: 3 })}>
        <Field label="Repository">
          <Select {...register("repositoryId")}>
            <option value="">選択してください</option>
            {repositories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.fullName}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Branch">
          <Select {...register("branch")}>
            <option value="">選択してください</option>
            {(branches.length > 0 ? branches : ["main"]).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </section>
  );
};
