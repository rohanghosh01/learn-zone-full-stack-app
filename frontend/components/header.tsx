"use client";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Notifications } from "./notification";
import { Search } from "./search";
import { useSelector } from "react-redux";
import config from "../config/config.json";
import { MoreOption } from "./header-more-option";
import { ToolTip } from "./tooltip-provider";
import { useEffect, useState } from "react";
const defaultProfile = config.DEFAULT_PROFILE;
export const Header = () => {
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
    },
    {
      name: "Live*",
      path: "/pages/live",
    },
    {
      name: "Chats*",
      path: `/pages/chats/${userInfo?.id}`,
    },
  ];

  return (
    <header className="fixed w-full  top-0 z-50 border-border/80  backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link
          href="/pages/home"
          className=" flex items-center space-x-2 lg:flex-1"
        >
          <img
            src="/assets/logo.png"
            className="mr-3 h-6 sm:h-9"
            alt="Learn zone"
          />
        </Link>
        <div className="flex gap-4 flex-1 justify-center">
          {!authRoute && (
            <nav className="items-center gap-4 text-sm lg:gap-6 md:flex hidden justify-center">
              {pages.map(({ name, path }: any, index: number) => (
                <Link
                  href={path}
                  aria-current="page"
                  className="transition-colors hover:text-foreground/80 text-foreground"
                  key={index}
                >
                  <div className="w-full">
                    {name}
                    {pathname == path && (
                      <p className="w-full h-[2px] bg-green-600 overflow-hidden" />
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {!authRoute && (
          <div>
            <Search />
          </div>
        )}
        <div className="flex items-center justify-center space-x-2 md:justify-end lg:flex-1 ml-auto ">
          {authRoute ? (
            <Link
              href={loginRoute ? "/auth/signup" : "/auth/login"}
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              {loginRoute ? "Sign Up" : "Sign In"}
            </Link>
          ) : (
            <nav className="flex items-center gap-3">
              <Link href={`/pages/profile/${profileId && profileId}`}>
                <ToolTip name="Go to Profile">
                  <div className="h-full w-full">
                    <Avatar className="lg:mr-4 cursor-pointer">
                      <AvatarImage
                        src={userInfo?.profileImage || defaultProfile}
                        alt="profile"
                        className="object-cover"
                      />
                    </Avatar>
                  </div>
                </ToolTip>
              </Link>
              <ToolTip name="Notifications">
                <div className={style}>
                  <Notifications />
                </div>
              </ToolTip>

              <ToolTip name="Theme mode">
                <div>
                  <ModeToggle />
                </div>
              </ToolTip>

              <ToolTip name="More options">
                <div className={style}>
                  <MoreOption />
                </div>
              </ToolTip>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
