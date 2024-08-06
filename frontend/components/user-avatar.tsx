import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Camera, Loader } from "lucide-react";
import config from "../config/config.json";
const defaultProfile = config.DEFAULT_PROFILE;

export function UserAvatar({
  url,
  size,
  fallback,
  handleFileChange,
  uploading,
  profile,
}: {
  url?: string;
  size?: "small" | "large" | "medium";
  fallback?: string;
  handleFileChange?: any;
  uploading?: boolean;
  profile?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex justify-center">
        <div
          className="flex items-center align-middle content-center justify-center top-[125px] left-[155px] relative cursor-pointer w-7 h-7 dark:bg-black 
      bg-gray-200 rounded-full z-50 overflow-hidden"
        >
          <Camera />
          <input
            type="file"
            className="opacity-0 absolute"
            onChange={handleFileChange}
          />
        </div>
        <Avatar
          className={cn(
            "mr-4 cursor-pointer  border-2 border-gray-600 dark:border-gray-300 relative",
            size === "large" && "w-40 h-40"
          )}
        >
          {uploading ? (
            <Loader
              className={cn(
                "absolute top-1/3 left-1/3 text-black dark:text-white z-50 cursor-pointer w-12 h-12 animate-spin"
                // profile ? "left-[350px]" : "inset-x-44"
              )}
            />
          ) : (
            <AvatarImage
              src={url || defaultProfile}
              alt="profile"
              className="object-cover"
            />
          )}
        </Avatar>
      </div>
    </div>
  );
}
