import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";
import type { CreateApplicationInput } from "~/repository/application";

export const useCreateApplication = () => {
	const { applicationRepository, projectRepository } = useRepository();
	const queryClient = useQueryClient();
	const { pushToast } = useToast();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (input: CreateApplicationInput) =>
			applicationRepository.createApplication(input),
		onSuccess: (result) => {
			pushToast({ type: "success", title: "アプリケーションが作成されました" });
			queryClient.invalidateQueries({
				queryKey: applicationRepository.listApplications$$key(),
			});
			queryClient.invalidateQueries({
				queryKey: projectRepository.listProjects$$key(),
			});
			if (result.initialDeploymentID) {
				navigate(`/deployments/${result.initialDeploymentID}`);
			} else {
				navigate("/applications");
			}
		},
		onError: (error) => {
			pushToast({
				type: "error",
				title: "Failed to create application",
				description: error instanceof Error ? error.message : "unknown error",
			});
		},
	});
};
