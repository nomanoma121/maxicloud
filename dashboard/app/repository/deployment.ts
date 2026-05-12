import { Code, ConnectError } from "@connectrpc/connect";
import { DEPLOYMENT_STATUS, type ValueOf } from "~/constants";
import type { Deployment as ProtoDeployment } from "~/gen/maxicloud/v1/deployment_pb";
import { DeploymentStatus as ProtoDeploymentStatus } from "~/gen/maxicloud/v1/deployment_pb";
import { connectClient } from "~/utils/connect";
import { formatDuration, formatTimestamp } from "~/utils/date";

export type DeploymentStatus = ValueOf<typeof DEPLOYMENT_STATUS>;

export type Commit = {
	sha: string;
	shortSHA: string;
	message: string;
	authorName: string;
	timestamp: string;
};

export type Deployment = {
	id: string;
	applicationId: string;
	ownerId: string;
	commit: Commit;
	status: DeploymentStatus;
	startedAt: string;
	finishedAt?: string;
	duration?: string;
};

export interface IDeploymentRepository {
	listDeployments$$key(): readonly ["deployments"];
	getDeployment$$key(id: string): readonly ["deployments", string];
	listDeployments(): Promise<Deployment[]>;
	getDeployment(id: string): Promise<Deployment | undefined>;
}

export const mapDeploymentStatus = (
	status: ProtoDeploymentStatus,
): DeploymentStatus => {
	switch (status) {
		case ProtoDeploymentStatus.SUCCESS:
			return DEPLOYMENT_STATUS.SUCCESS;
		case ProtoDeploymentStatus.IN_PROGRESS:
			return DEPLOYMENT_STATUS.IN_PROGRESS;
		case ProtoDeploymentStatus.FAILED:
			return DEPLOYMENT_STATUS.FAILED;
		default:
			return DEPLOYMENT_STATUS.IN_PROGRESS;
	}
};

const toDeployment = (deployment: ProtoDeployment): Deployment => {
	// Protoでは必須型として定義されているが生成物がoptionalになってしまうため、型ガードを入れる
	if (!deployment.startedAt || !deployment.commit?.timestamp) {
		throw new Error(
			`Invalid deployment data received for ID: ${deployment.id}`,
		);
	}
	const shortSHA = deployment.commit.sha.slice(0, 7);
	const deploy = {
		id: deployment.id,
		applicationId: deployment.applicationId,
		ownerId: deployment.ownerUserId,
		commit: {
			sha: deployment.commit.sha,
			shortSHA: shortSHA,
			message: deployment.commit.message,
			authorName: deployment.commit.authorName,
			timestamp: formatTimestamp(deployment.commit.timestamp),
		},
		status: mapDeploymentStatus(deployment.status),
		startedAt: formatTimestamp(deployment.startedAt),
	};

	if (deployment.finishedAt) {
		return {
			...deploy,
			finishedAt: formatTimestamp(deployment.finishedAt),
			duration: formatDuration(deployment.startedAt, deployment.finishedAt),
		};
	}

	return deploy;
};

export class DeploymentRepository implements IDeploymentRepository {
	listDeployments$$key() {
		return ["deployments"] as const;
	}

	getDeployment$$key(id: string) {
		return ["deployments", id] as const;
	}

	async listDeployments(): Promise<Deployment[]> {
		const { projects } = await connectClient.project.listProjects({});
		const list = await Promise.all(
			projects.map(async (project) =>
				connectClient.application.listApplications({ projectId: project.id }),
			),
		);

		const applications = list.flatMap((item) => item.applications);
		const deployments = await Promise.all(
			applications.map(async (application) =>
				connectClient.deployment.listDeployments({
					applicationId: application.id,
				}),
			),
		);

		return deployments
			.flatMap((item) => item.deployments)
			.map(toDeployment)
			.sort((a, b) => (a.startedAt > b.startedAt ? -1 : 1));
	}

	async getDeployment(id: string): Promise<Deployment | undefined> {
		try {
			const res = await connectClient.deployment.getDeployment({
				deploymentId: id,
			});
			if (!res.deployment) {
				return undefined;
			}
			return toDeployment(res.deployment);
		} catch (error) {
			if (error instanceof ConnectError && error.code === Code.NotFound) {
				return undefined;
			}
			throw error;
		}
	}
}
