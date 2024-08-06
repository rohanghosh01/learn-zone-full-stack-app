import { ArrowLeft, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Messages } from "./index";
import { useEffect, useState } from "react";

export const MessageHeader = ({
  searchOpen,
  setSearchOpen,
  sheetOpen,
  setSheetOpen,
  isMobile,
  isDesktop,
  getMessages,
  setUserList,
  userList,
  selected,
  setSelected,
  setSelectedUserId,
  tab,
  setTab,
  handleMessageClick,
  setRoomId,
}: any) => {
  const [buttonClick, setButtonClick] = useState(false);
  useEffect(() => {
    setButtonClick(false);
    if (buttonClick && isMobile) {
      setSheetOpen(true);
    }

    if (isDesktop) {
      setSheetOpen(false);
    }
  }, [isMobile, isDesktop]);

  if (isDesktop) {
    return null;
  }

  return (
    <div>
      <div className="flex lg:hidden mt-1 ml-2">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden rounded-full"
              onClick={() => {
                setButtonClick(!buttonClick);
              }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full">
            <Messages
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              isMobile={true}
              getMessages={getMessages}
              userList={userList}
              setUserList={setUserList}
              selected={selected}
              setSelected={setSelected}
              setSelectedUserId={setSelectedUserId}
              setSheetOpen={setSheetOpen}
              tab={tab}
              setTab={setTab}
              handleMessageClick={handleMessageClick}
              setRoomId={setRoomId}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
