"use client";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Notifications } from "@/components/notification";
import { Search } from "@/components/search";
import { useSelector } from "react-redux";
import config from "../../../../config/config.json";
import { MoreOption } from "@/components/header-more-option";
import { ToolTip } from "@/components/tooltip-provider";
import { useEffect, useState } from "react";
import {
  Bell,
  Home,
  LogOut,
  MessageSquareText,
  Radio,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
const defaultProfile = config.DEFAULT_PROFILE;
export const SidebarMenu = () => {
  const pathname = usePathname();
  const authRoute = pathname.split("/")[1] === "auth";
  const loginRoute = pathname.includes("/auth/login");
  const userInfo = useSelector((state: any) => state?.user);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setProfileId(userInfo?.id);
    }
  }, [userInfo]);

  const style =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 py-2 w-10 overflow-visible";

  const pages = [
    {
      name: "Home",
      path: "/pages/home",
      icon: <Home />,
    },
    {
      name: "Live*",
      path: "/pages/live",
      icon: <Radio />,
    },
    {
      name: "Messages",
      path: `/pages/chats/${userInfo?.id}`,
      icon: <MessageSquareText />,
    },
    {
      name: "Notifications",
      path: `/pages/notification`,
      icon: <Bell />,
    },
  ];

  return (
    <div className="container flex gap-10 flex-col h-full">
      <Link href="/pages/home" className=" flex items-center mt-2">
        <img
          src="/assets/logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="Learn zone"
        />
      </Link>
      {!authRoute && (
        <div>
          <Search />
        </div>
      )}
      <div className="flex flex-col">
        {!authRoute && (
          <nav className="gap-4  w-full text-sm flex flex-col">
            {pages.map(({ name, path, icon }: any, index: number) => (
              <Link
                href={path}
                aria-current="page"
                className="transition-colors hover:text-foreground/80 text-foreground"
                key={index}
              >
                <div
                  className={cn(
                    "w-full flex h-12  rounded-lg gap-6 items-center pl-3 hover:dark:bg-gray-700 hover:bg-gray-300 relative",
                    pathname == path ? " dark:bg-gray-700 bg-gray-300" : ""
                  )}
                >
                  <span
                    className={cn(
                      "absolute h-10 w-[3px] top-1 left-0 rounded-full ml-[2px]",
                      pathname == path ? " bg-pink-700" : ""
                    )}
                  />
                  {icon}
                  <span className="w-full text-base font-semibold">
                    {" "}
                    {name}
                  </span>
                  {/* {pathname == path && (
                    <p className="w-full h-[2px] bg-green-600 overflow-hidden" />
                  )} */}
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>

      <div className="flex flex-col mt-auto mb-5">
        {authRoute ? (
          <Link
            href={loginRoute ? "/auth/signup" : "/auth/login"}
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            {loginRoute ? "Sign Up" : "Sign In"}
          </Link>
        ) : (
          <div className="flex flex-col justify-start items-baseline gap-5">
            <div className="cursor-pointer flex gap-3 dark:bg-gray-800 bg-gray-200 w-64 h-14 rounded-lg p-4 items-center">
              <Avatar className="lg:mr-4 cursor-pointer">
                <AvatarImage
                  src={userInfo?.profileImage || defaultProfile}
                  alt="profile"
                  className="object-cover"
                />
              </Avatar>
              <span className="w-full whitespace-nowrap">
                {userInfo?.name || "N/A"}
              </span>
              <MoreOption profileId={profileId} />
            </div>
            {/* <div className="cursor-pointer flex gap-1 w-64 h-14 rounded-lg p-4 items-center">
              <span>Notifications</span>
              <Notifications />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};
