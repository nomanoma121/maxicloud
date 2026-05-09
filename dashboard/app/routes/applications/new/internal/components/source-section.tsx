import { useMemo } from "react";
import { GitHub } from "react-feather";
import { useFormContext, useWatch } from "react-hook-form";
import { css } from "styled-system/css";
import { Form } from "~/components/ui/form";
import { useGitHubBranches, useGitHubRepositories } from "../hooks/use-source";
import type { CreateApplicationInputValues } from "../schema";
import { SectionHeading } from "./section-heading";

export const SourceSection = () => {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<CreateApplicationInputValues>();
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
				<Form.Field.Select
					label="Repository"
					required
					error={errors.repositoryId?.message}
					{...register("repositoryId")}
				>
					<option value="">選択してください</option>
					{repositories.map((item) => (
						<option key={item.id} value={item.id}>
							{item.fullName}
						</option>
					))}
				</Form.Field.Select>

				<Form.Field.Select
					label="Branch"
					required
					error={errors.branch?.message}
					{...register("branch")}
				>
					<option value="">選択してください</option>
					{(branches.length > 0 ? branches : ["main"]).map((value) => (
						<option key={value} value={value}>
							{value}
						</option>
					))}
				</Form.Field.Select>
			</div>
		</section>
	);
};
