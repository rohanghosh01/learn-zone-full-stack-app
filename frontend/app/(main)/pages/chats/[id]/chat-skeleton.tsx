"use client";
import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ChatSkeleton() {
  return (
    <div className="flex justify-evenly">
      {/* Skeleton for the first card */}
      <div className="lg:flex flex-col lg:m-10 min-h-[80vh] hidden w-auto">
        <div className="flex flex-row items-center p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="rounded-full h-10 w-10" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="ml-auto rounded-full h-8 w-8" />
        </div>
      </div>

      {/* Skeleton for the second card */}
      <div className="flex flex-col lg:m-10 min-h-[80vh] flex-1">
        <div className="flex flex-row items-center p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="rounded-full h-10 w-10" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="ml-auto rounded-full h-8 w-8" />
        </div>
        <div className="w-full h-full p-4 space-y-4">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-2/3 rounded-lg ml-auto" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
        </div>
        <div className="mt-auto p-4 flex w-full items-center space-x-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
