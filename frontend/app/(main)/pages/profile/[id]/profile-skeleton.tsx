"use client";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfileSkeleton({ isGrid }: any) {
  return (
    <div
      className={cn(
        "flex flex-rows items-start p-4 justify-start  max-sm:justify-center  max-sm:gap-1 gap-10 max-sm:flex-wrap",
        isGrid
          ? "space-y-4 md:max-w-[350px] xl:max-w-[400px] lg:w-[700px]"
          : "space-y-4 md:max-w-[850px] xl:max-w-[1000px] lg:w-[700px]"
      )}
    >
      <div className="photo">
        <div className="border-0 w-40 h-40 md:w-60 md:h-60 mb-4">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
      </div>
      <div className="details">
        <div className="username flex gap-4  max-sm:justify-center  max-sm:flex-wrap">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="other-info flex  gap-4 flex-wrap">
          <div className="flex space-x-4 my-4 gap-8">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-wrap">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
