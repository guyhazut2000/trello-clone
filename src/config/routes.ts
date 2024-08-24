import { HomeIcon, Layers3, ListTodo, SettingsIcon } from "lucide-react";

export const routes = [
  { path: "/", name: "Home", icon: HomeIcon },
  { path: "/projects", name: "Projects", icon: Layers3 },
  { path: "/tasks", name: "Tasks", icon: ListTodo },
  { path: "/settings", name: "Settings", icon: SettingsIcon },
];
