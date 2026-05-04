import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { useFormContext } from "react-hook-form";
import { Form } from "~/components/ui/form";
import { useProjectsQuery } from "~/hooks";
import { SectionHeading } from "./section-heading";
import { CreateApplicationInputValues } from "../schema";

export const ProjectSection = () => {
  const { register, formState: { errors } } = useFormContext<CreateApplicationInputValues>();
  const { data: projects } = useProjectsQuery();

  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading
        icon={<Folder size={15} />}
        title="0. Project"
        description="Applicationを追加するProject"
      />
      <Form.Field.Select
        label="Project"
        required
        error={errors.projectId?.message}
        {...register("projectId")}
      >
        <option value="">選択してください</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </Form.Field.Select>
    </section>
  );
};
