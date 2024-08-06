"use client";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FeedSkeleton({ isGrid }: any) {
  return (
    <div
      className={cn(
        isGrid
          ? "space-y-4 md:max-w-[350px]  xl:max-w-[400px] lg:w-[700px]"
          : "space-y-4 md:max-w-[850px]  xl:max-w-[1000px] lg:w-[700px]"
      )}
    >
      {/* Skeleton for Card Header */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Skeleton for Card Content */}
      <Skeleton className="h-[400px]" />

      {/* Skeleton for Card Footer */}
      <div className="flex gap-4">
        {/* Skeleton for Like Button */}
        <div className="flex flex-col gap-1 text-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Skeleton for Comment Button */}
        <div className="flex flex-col gap-1 text-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Skeleton for Share Button */}
        <div className="flex flex-col gap-1 text-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        {/* Skeleton for Save Button */}
        <div className="flex flex-col gap-1 text-center justify-center ml-auto">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
