"use client";
import { cn } from "@/lib/utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect, useRef, useState } from "react";
import { ToolTip } from "./tooltip-provider";
import { Button } from "./ui/button";
import { SmilePlus } from "lucide-react";

export function Emoji({
  insertEmoji,
  className,
  height,
  width,
}: {
  insertEmoji: (emoji: string) => void;
  className?: string;
  height?: string | number;
  width?: string | number;
}) {
  const [openEmoji, setOpenEmoji] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const onEmojiClick = (event: any) => {
    insertEmoji(event.native);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
      setOpenEmoji(false);
    }
  };

  useEffect(() => {
    if (openEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openEmoji]);

  return (
    <>
      <ToolTip name="Emoji" side="top">
        <SmilePlus
          className="h-4 w-4"
          onClick={() => setOpenEmoji(!openEmoji)}
        />
      </ToolTip>

      {openEmoji && (
        <div ref={emojiRef} className={cn("absolute ", className)}>
          <Picker data={data} onEmojiSelect={onEmojiClick} />
        </div>
      )}
    </>
  );
}
