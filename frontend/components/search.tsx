"use client";

import * as React from "react";
import { CalendarIcon, Search as SearchIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { ToolTip } from "./tooltip-provider";

export function Search({ isMobile }: { isMobile?: boolean }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = () => {
    setOpen((open) => !open);
  };

  return (
    <>
      {isMobile ? (
        <div onClick={handleSearch} className="flex flex-col items-center">
          <SearchIcon className="mr-1 w-5 h-5" />
          <span>Search</span>
        </div>
      ) : (
        <Button
          onClick={handleSearch}
          className="md:inline-flex hidden items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 overflow-clip"
          variant="secondary"
        >
          <div>
            <ToolTip name="Search">
              <SearchIcon className="mr-1 w-5 h-5" />
            </ToolTip>
          </div>
          <p className="text-sm text-muted-foreground">
            Search...
            <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex overflow-visible">
              <span className="text-sm">⌘</span>K
            </kbd>
          </p>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>valendar</span>
            </CommandItem>
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Cavlendar</span>
            </CommandItem>
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calevvndar</span>
            </CommandItem>
            {/* <CommandItem>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem> */}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
