import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("login", "routes/login/page.tsx"),
  route("register", "routes/register/page.tsx"),
  layout("routes/layout.tsx", [
    index("routes/home/page.tsx"),
    route("projects", "routes/projects/page.tsx"),
    route("projects/new", "routes/projects/new/page.tsx"),
    route("projects/:projectId", "routes/projects/detail/page.tsx"),
    route("applications", "routes/applications/page.tsx"),
    route("applications/new", "routes/applications/new/page.tsx"),
    route("applications/:applicationId", "routes/applications/detail/page.tsx"),
    ...prefix("deployments", [
      index("routes/deployments/page.tsx"),
      route(":deploymentId", "routes/deployments/detail/page.tsx"),
    ]),
    route("settings", "routes/settings/page.tsx"),
  ]),
] satisfies RouteConfig;
