import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { useFormContext } from "react-hook-form";
import { Select } from "~/components/ui/form-controls";
import { useProjectsQuery } from "~/hooks";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";

export const ProjectSection = () => {
  const { register } = useFormContext<CreateApplicationInputValues>();
  const { data: projects = [] } = useProjectsQuery();

  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading
        icon={<Folder size={15} />}
        title="0. Project"
        description="Applicationを追加するProject"
      />
      <Field label="Project">
        <Select {...register("projectId")}>
          <option value="">選択してください</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      </Field>
    </section>
  );
};
