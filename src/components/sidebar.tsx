import { routes } from "@/config/routes";
import Link from "next/link";
import React from "react";

export const Sidebar = () => {
  return (
    <div className="flex flex-col space-y-2 text-gray-500 py-4 border-r h-full px-2">
      {routes.map((route) => (
        <SidebarItem key={route.path} route={route} />
      ))}
    </div>
  );
};

interface SidebarItemProps {
  route: {
    name: string;
    path: string;
    icon: any; // Replace with your own icon component
  };
}

const SidebarItem = ({ route }: SidebarItemProps) => {
  const Icon = route.icon;

  return (
    <Link
      href={route.path}
      className="flex items-center space-x-2 w-full hover:bg-gray-100 rounded-lg px-2 py-1 cursor-pointer select-none"
    >
      <Icon className="h-5 w-5" />
      <span>{route.name}</span>
    </Link>
  );
};
