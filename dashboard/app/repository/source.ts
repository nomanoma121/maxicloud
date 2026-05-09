import { GIT_PROVIDER, type ValueOf } from "~/constants";
import { connectClient } from "~/utils/connect";

export type GitRepository = {
	id: string;
	provider: ValueOf<typeof GIT_PROVIDER>;
	fullName: string;
	defaultBranch: string;
	branches: string[];
	dockerfilePaths: string[];
};

export interface ISourceRepository {
	listGitHubRepositories$$key(): readonly ["github-repositories"];
	listGitHubBranches$$key(
		fullName: string,
	): readonly ["github-repositories", string, "branches"];
	listGitHubRepositories(): Promise<GitRepository[]>;
	listGitHubBranches(fullName: string): Promise<string[]>;
}

const parseRepositoryFullName = (
	fullName: string,
): { owner: string; name: string } => {
	const [owner = "", name = ""] = fullName.split("/", 2);
	return { owner, name };
};

export class SourceRepository implements ISourceRepository {
	listGitHubRepositories$$key() {
		return ["github-repositories"] as const;
	}

	listGitHubBranches$$key(fullName: string) {
		return ["github-repositories", fullName, "branches"] as const;
	}

	async listGitHubRepositories(): Promise<GitRepository[]> {
		const { repositories } = await connectClient.github.listRepositories({});
		return repositories.map((repository) => {
			const fullName = `${repository.owner}/${repository.name}`;
			return {
				id: fullName,
				provider: GIT_PROVIDER.GITHUB,
				fullName,
				defaultBranch: "main",
				branches: [],
				dockerfilePaths: ["Dockerfile"],
			} satisfies GitRepository;
		});
	}

	async listGitHubBranches(fullName: string): Promise<string[]> {
		const parsed = parseRepositoryFullName(fullName);
		if (!parsed.owner || !parsed.name) {
			return ["main"];
		}

		const res = await connectClient.github.listBranches({
			repository: {
				owner: parsed.owner,
				name: parsed.name,
			},
		});
		if (res.branches.length === 0) {
			return ["main"];
		}
		return res.branches;
	}
}
