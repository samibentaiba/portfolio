import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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

        {/* Categories and Skills Skeleton */}
        <div className="space-y-12">
          {[1, 2, 3].map((category) => (
            <section key={category}>
              <div className="mb-6">
                <Skeleton className="h-8 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((skill) => (
                  <Card key={skill} className="h-full">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-1/3 mt-1" />
                    </CardHeader>
                    <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-4/5 mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
