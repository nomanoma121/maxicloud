import { useState } from "react";
import { useNavigate } from "react-router";
import { FolderPlus, Layers } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Input, Select, Textarea } from "~/components/ui/form-controls";
import { useCreateProjectMutation } from "~/hooks/use-maxicloud-mutation";
import { useUsersQuery } from "~/hooks/use-maxicloud-query";
import { useSession } from "~/hooks/use-session";
import { Panel } from "~/components/ui/panel";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const { currentUser } = useSession();
  const { data: users = [] } = useUsersQuery();
  const { mutateAsync: createProject, isPending } = useCreateProjectMutation();

  const [name, setName] = useState("my-project");
  const [description, setDescription] = useState("複数Applicationを管理するProject");
  const [ownerId, setOwnerId] = useState(currentUser?.id ?? users[0]?.id ?? "");

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Projects", href: "/projects", icon: <Layers size={14} /> },
          { label: "New", icon: <FolderPlus size={14} /> },
        ]}
      />

      <DashboardHeader
        title="New Project"
        subtitle="Projectを作成して、その配下に複数Applicationを作成します"
      />

      <Panel>
        <form
          className={css({ display: "grid", gap: 3 })}
          onSubmit={async (event) => {
            event.preventDefault();
            await createProject({ name, description, ownerId });
            navigate("/projects");
          }}
        >
          <Field label="Project Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
          </Field>
          <Field label="Owner">
            <Select value={ownerId} onChange={(event) => setOwnerId(event.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
                </option>
              ))}
            </Select>
          </Field>

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </Panel>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className={css({ display: "grid", gap: 1 })}>
    <span className={css({ fontSize: "sm", fontWeight: 600, color: "gray.600" })}>{label}</span>
    {children}
  </label>
);
