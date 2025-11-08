import { Shimmer } from "@/components/shimmer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProjectLoading() {
  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-6 sm:mb-8">
          <Shimmer className="h-6 w-48 mb-4" />
          <Shimmer className="h-10 w-3/4 mb-3" />
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            <Shimmer className="h-8 w-20" />
            <Shimmer className="h-8 w-20" />
            <Shimmer className="h-8 w-20" />
          </div>
        </div>

        <Shimmer className="relative aspect-video rounded-lg mb-6 sm:mb-8 w-full" />

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Shimmer className="h-10 w-36" />
          <Shimmer className="h-10 w-36" />
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <Shimmer className="h-7 w-40" />
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 space-y-2">
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-2/3" />
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <Shimmer className="h-7 w-48" />
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 space-y-4">
              <div>
                <Shimmer className="h-5 w-32 mb-2" />
                <Shimmer className="h-4 w-40" />
              </div>
              <div>
                <Shimmer className="h-5 w-32 mb-2" />
                <Shimmer className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <Shimmer className="h-7 w-48" />
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 space-y-2">
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
