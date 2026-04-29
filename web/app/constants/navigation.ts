import type { Icon } from "react-feather";
import { Box, Folder, Home, Layers, Settings } from "react-feather";

export type NavigationItem = {
  to: string;
  label: string;
  icon: Icon;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/projects", label: "Projects", icon: Folder },
  { to: "/services", label: "Services", icon: Box },
  { to: "/deployments", label: "Deployments", icon: Layers },
  { to: "/settings", label: "Workspace", icon: Settings },
];
