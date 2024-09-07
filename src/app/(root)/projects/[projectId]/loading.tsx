import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectPageLoading() {
  return (
    <div className="space-y-4 p-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Filter/Controls Skeleton */}
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Project Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
