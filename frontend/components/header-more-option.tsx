"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  LogOut,
  Settings,
  Menu,
  ArrowDownIcon,
  ChevronDown,
  User2,
} from "lucide-react";
import { ToolTip } from "./tooltip-provider";
import Link from "next/link";
import { useState } from "react";
import { Notifications } from "./notification";
import { ModeToggle } from "./theme-toggle";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const MoreOption = ({ profileId }: any) => {
  const { setTheme, theme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState(theme);
  // This can come from your database or API.

  const handleThemeClick = (e: any) => {
    e.stopPropagation(); // Prevents the click event from propagating to MenubarItem
    // Handle theme switch logic here
    if (currentTheme == "dark") {
      setTheme("light");
      setCurrentTheme("light");
    } else {
      setTheme("dark");
      setCurrentTheme("dark");
    }
  };
  return (
    <>
      <Menubar className="w-20 h-10 rounded-none overflow-visible outline-none border-0 bg-transparent flex justify-center">
        <MenubarMenu>
          <MenubarTrigger
            asChild
            className="w-auto h-10 data-[state=open]:bg-transparent focus:bg-transparent cursor-pointer"
          >
            <ChevronDown />
          </MenubarTrigger>
          <MenubarContent className="w-full flex flex-col gap-2" align="center">
            <Link href={`/pages/profile/${profileId && profileId}`}>
              <MenubarItem className="cursor-pointer flex justify-around">
                View Profile
                <User2 className="w-5 h-5" />
              </MenubarItem>
            </Link>

            <Link href="/pages/settings">
              <MenubarItem className="cursor-pointer flex justify-around">
                Settings
                <Settings className="w-5 h-5" />
              </MenubarItem>
            </Link>
            <Link href="/pages/logout">
              <MenubarItem className="cursor-pointer flex justify-around">
                Log out
                <LogOut className="w-5 h-5 text-red-700" />
              </MenubarItem>
            </Link>
            <MenubarItem className="cursor-pointer flex justify-around">
              Theme
              <div className="theme-switcher" onClick={handleThemeClick}>
                <div
                  className={cn(
                    "theme-icon",
                    theme == "light" ? " active" : "false"
                  )}
                >
                  <img
                    src="https://web.laparizone.com//images/icons/light-theme.svg"
                    width="13"
                    height="13"
                    alt="image"
                  />
                </div>
                <div
                  className={cn(
                    "theme-icon",
                    theme == "dark" ? " active" : "false"
                  )}
                >
                  <img
                    src="https://web.laparizone.com//images/icons/dark-theme.svg"
                    width="13"
                    height="13"
                    alt="image"
                  />
                </div>
              </div>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
};
