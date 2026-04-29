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
    route("services", "routes/services/page.tsx"),
    route("services/new", "routes/services/new/page.tsx"),
    route("services/:serviceId", "routes/services/detail/page.tsx"),
    ...prefix("deployments", [
      index("routes/deployments/page.tsx"),
      route(":deploymentId", "routes/deployments/detail/page.tsx"),
    ]),
    route("settings", "routes/settings/page.tsx"),
  ]),
] satisfies RouteConfig;
