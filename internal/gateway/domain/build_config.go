package domain

type DockerfileSource interface {
	dockerfileSource()
}

type DockerfileSourcePath struct {
	Path string
}

type DockerfileSourceInline struct {
	Content string
}

func (d DockerfileSourcePath) dockerfileSource()   {}
func (d DockerfileSourceInline) dockerfileSource() {}

type BuildConfig interface{ buildConfig() }

type BuildConfigDockerfile struct {
	Source DockerfileSource
}

type BuildConfigNixpacks struct{}

func (b BuildConfigDockerfile) buildConfig() {}
func (b BuildConfigNixpacks) buildConfig()   {}
