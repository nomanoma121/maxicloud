import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { useUsersQuery } from "~/hooks";
import { useSession } from "~/hooks/use-session";
import { useToast } from "~/hooks/use-toast";
import { useCreateProject } from "~/routes/projects/new/internal/hooks/use-create-project";
import {
  CreateProjectSchema,
  type CreateProjectInput,
  type CreateProjectOutput,
} from "~/routes/projects/new/internal/schema";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { currentUser } = useSession();
  const { data: users = [] } = useUsersQuery();
  const { mutateAsync: createProject, isPending } = useCreateProject();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectInput, unknown, CreateProjectOutput>({
    resolver: valibotResolver(CreateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      ownerId: "",
    },
  });

  // ユーザー一覧取得後にデフォルト owner をセット
  useEffect(() => {
    const defaultId = currentUser?.id ?? users[0]?.id;
    if (defaultId) setValue("ownerId", defaultId);
  }, [currentUser, users, setValue]);

  const onSubmit = async (data: CreateProjectOutput) => {
    try {
      await createProject(data);
      pushToast({ type: "success", title: "Project created" });
      navigate(APP_ROUTES.projects);
    } catch (error) {
      pushToast({
        type: "error",
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "unknown error",
      });
    }
  };

  return (
    <Panel>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <Form.FieldSet>
          <Form.Field.TextInput
            label="Project Name"
            required
            error={errors.name?.message}
            {...register("name")}
          />

          <Form.Field.TextArea
            label="Description"
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <Form.Field.WithLabel label="Owner" required>
            {(id) => (
              <>
                <Form.Select id={id} {...register("ownerId")}>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.displayName}
                    </option>
                  ))}
                </Form.Select>
                <Form.ErrorDisplay error={errors.ownerId?.message} />
              </>
            )}
          </Form.Field.WithLabel>

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        </Form.FieldSet>
      </form>
    </Panel>
  );
}
