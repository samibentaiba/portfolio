import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              <Skeleton className="h-6 w-1/4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            <Skeleton className="h-8 w-1/3" />
          </h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <Skeleton className="h-6 w-2/3" />
                    </CardTitle>
                    <Skeleton className="h-6 w-1/5" />
                  </div>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    <Skeleton className="h-4 w-1/2" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
