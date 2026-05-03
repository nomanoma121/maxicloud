import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { Select } from "~/components/ui/form-controls";
import type { Project } from "~/types";
import { Field } from "./field";
import { SectionHeading } from "./section-heading";

type ProjectSectionProps = {
  projectId: string;
  setProjectId: (value: string) => void;
  projects: Project[];
};

export const ProjectSection = ({
  projectId,
  setProjectId,
  projects,
}: ProjectSectionProps) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading
        icon={<Folder size={15} />}
        title="0. Project"
        description="Applicationを追加するProject"
      />
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
  );
};
