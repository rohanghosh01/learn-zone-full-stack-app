"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const MyDiv = ({
    type,
    children,
  }: {
    type: "light" | "dark" | "system";
    children: React.ReactNode;
  }) => {
    return (
      <MenubarItem
        onClick={() => setTheme(type)}
        className="w-full cursor-pointer"
      >
        {children}
      </MenubarItem>
    );
  };

  return (
    <Menubar className="w-10 overflow-hidden outline-none border-0 bg-transparent cursor-pointer">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="link" className="w-full cursor-pointer">
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </MenubarTrigger>

        <MenubarContent align="center">
          <MyDiv type="light">Light</MyDiv>
          <MyDiv type="dark">Dark</MyDiv>
          <MyDiv type="system">System</MyDiv>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
