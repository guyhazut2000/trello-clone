import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="h-20 border-b flex items-center justify-start px-4">
      <UserButton />
    </div>
  );
};
