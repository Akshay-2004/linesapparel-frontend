import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BannerCardSkeleton() {
    return (
        <Card className="w-full h-full">
            <Skeleton className="aspect-[3/2] w-full rounded-b-none" />
            <CardContent className="px-6 pt-4 pb-6 flex flex-col justify-between h-full">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                </div>
                <div className="mt-4">
                    <Skeleton className="h-10 w-[140px]" />
                </div>
            </CardContent>
        </Card>
    );
}

