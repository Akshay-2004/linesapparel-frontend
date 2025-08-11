import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <Card className="w-full">
      <Skeleton className="aspect-[3/4] w-full rounded-b-none" />
      <CardContent className="px-6 pt-4 pb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-6 w-[70px]" />
          </div>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  );
}
