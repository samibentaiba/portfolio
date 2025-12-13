import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-5 w-36 mb-4" />
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden h-full flex flex-col">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="p-4 sm:pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-1">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-3 sm:p-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
