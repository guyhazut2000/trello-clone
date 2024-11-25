"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React from "react";

interface Props {
  handleOnSearch: (searchTerm: string) => void;
}

export const ProjectSearchInput = ({ handleOnSearch }: Props) => {
  return (
    <div className="relative flex items-center w-full">
      <Input
        onChange={(e) => handleOnSearch(e.target.value)}
        type="search"
        className="pl-10 flex-1 items-center justify-center max-w-2xl"
        placeholder="Search projects..."
      />
      <SearchIcon className="absolute left-2 text-gray-200" />
    </div>
  );
};
