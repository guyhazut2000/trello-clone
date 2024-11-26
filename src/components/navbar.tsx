import { UserButton } from "@clerk/nextjs";
import { DarkModeToggle } from "./dark-mode-toggle";

export const Navbar = () => {
  return (
    <div className="h-20 border-b flex items-center justify-between px-4">
      <UserButton />
      <DarkModeToggle />
    </div>
  );
};
