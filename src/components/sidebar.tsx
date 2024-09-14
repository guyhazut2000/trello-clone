"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

import { routes } from "@/config/routes";

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
  const pathname = usePathname(); // Get the current path
  const Icon = route.icon;

  // Check if the current path matches the route path to mark the item as active
  const isActive =
    route.path === "/"
      ? pathname === "/"
      : pathname.startsWith(route.path.toLowerCase());

  return (
    <Link
      href={route.path}
      className={`flex items-center space-x-2 w-full rounded-lg px-2 py-1 cursor-pointer select-none 
        ${
          isActive
            ? "bg-blue-100 text-blue-400"
            : "hover:bg-gray-100 text-gray-500"
        }`}
    >
      <Icon
        className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-gray-500"}`}
      />
      <span>{route.name}</span>
    </Link>
  );
};
