"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "../settings";
import { ChangePassword } from "../changePassword";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ProfileTabs({ handleChangePassword, user }: any) {
  const [showPasswordTab, setShowPasswordTab] = useState<boolean>(false);

  useEffect(() => {
    setShowPasswordTab(user?.socialType === "email");
  }, [user]);

  return (
    <Tabs
      defaultValue="account"
      className="my-2 mx-3 p-6 m-w-[200px] max-w-[600px]"
    >
      <TabsList
        className={cn(
          "grid w-full",
          showPasswordTab ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        <TabsTrigger value="account">Settings</TabsTrigger>
        {showPasswordTab && (
          <TabsTrigger value="password">Change Password</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="account">
        <Settings />
      </TabsContent>

      {showPasswordTab && (
        <TabsContent value="password">
          <ChangePassword handleChangePassword={handleChangePassword} />
        </TabsContent>
      )}
    </Tabs>
  );
}
