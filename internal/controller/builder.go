package controller

import (
	"fmt"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/config"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func newBuildJobSecret(buildRun *maxicloudv1alpha1.BuildRun, dockerConfig, installationAccessToken string) *corev1.Secret {
	return &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      buildRun.Name,
			Namespace: buildRun.Namespace,
			OwnerReferences: []metav1.OwnerReference{
				*metav1.NewControllerRef(buildRun, maxicloudv1alpha1.GroupVersion.WithKind("BuildRun")),
			},
		},
		Data: map[string][]byte{
			corev1.DockerConfigJsonKey:        []byte(dockerConfig),
			config.InstallationAccessTokenKey: []byte(installationAccessToken),
		},
		Type: corev1.SecretTypeOpaque,
	}
}

type BuildJobParams struct {
	buildRun       *maxicloudv1alpha1.BuildRun
	jobName        string
	destination    string
	sha            string
	repoSecretName string
	owner          string
	repo           string
}

func newBuildJob(params BuildJobParams) *batchv1.Job {
	return &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      params.jobName,
			Namespace: params.buildRun.Namespace,
			OwnerReferences: []metav1.OwnerReference{
				*metav1.NewControllerRef(params.buildRun, maxicloudv1alpha1.GroupVersion.WithKind("BuildRun")),
			},
			Labels: params.buildRun.Labels,
		},
		Spec: batchv1.JobSpec{
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:  "buildkit",
							Image: "moby/buildkit:latest",
							Env: []corev1.EnvVar{
								{
									Name: "GITHUB_TOKEN",
									ValueFrom: &corev1.EnvVarSource{
										SecretKeyRef: &corev1.SecretKeySelector{
											LocalObjectReference: corev1.LocalObjectReference{Name: params.repoSecretName},
											Key:                  config.InstallationAccessTokenKey,
										},
									},
								},
							},
							Command: []string{
								"buildctl-daemonless.sh",
								"build",
								"--frontend=dockerfile.v0",
								"--opt", fmt.Sprintf("context=https://x-access-token:$(GITHUB_TOKEN)@github.com/%s/%s.git#%s", params.owner, params.repo, params.sha),
								"--opt", fmt.Sprintf("filename=%s", params.buildRun.Spec.Source.DockerfilePath),
								"--output", fmt.Sprintf("type=image,name=%s,push=true", params.destination),
							},
							SecurityContext: &corev1.SecurityContext{
								Privileged: boolPtr(false),
								RunAsUser:  int64Ptr(1000),
								RunAsGroup: int64Ptr(1000),
								SeccompProfile: &corev1.SeccompProfile{
									Type: corev1.SeccompProfileTypeUnconfined,
								},
							},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "registry-auth",
									MountPath: "/root/.docker",
								},
							},
						},
					},
					Volumes: []corev1.Volume{
						{
							Name: "registry-auth",
							VolumeSource: corev1.VolumeSource{
								Secret: &corev1.SecretVolumeSource{
									SecretName: params.repoSecretName,
									Items: []corev1.KeyToPath{
										{
											Key:  corev1.DockerConfigJsonKey,
											Path: "config.json",
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}
}

func boolPtr(b bool) *bool { return &b }

func int32Ptr(i int32) *int32 { return &i }

func int64Ptr(i int64) *int64 { return &i }
