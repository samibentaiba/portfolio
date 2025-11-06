import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeLoading() {
  return (
    <main className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-2xl w-full flex flex-col gap-6 mx-auto">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
        </div>
        <Card className="p-8 flex flex-col shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </Card>
      </div>
    </main>
  );
}