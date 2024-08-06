"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Settings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="w-full overflow-hidden"> Settings</CardTitle>
        <CardDescription>Manage your settings here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 ">
        <div className="flex items-center justify-between space-x-2 ">
          <Label htmlFor="necessary" className="flex flex-col space-y-1">
            <span className="w-full overflow-hidden">Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              This will be impact on your all push notifications
            </span>
          </Label>
          <Switch id="necessary" defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="functional" className="flex flex-col space-y-1">
            <span className="w-full overflow-hidden">Private account</span>
            <span className="font-normal leading-snug text-muted-foreground">
              If you want your account to be private turn it on
            </span>
          </Label>
          <Switch id="functional" />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="performance" className="flex flex-col space-y-1">
            <span className="w-full overflow-hidden">Performance Cookies</span>
            <span className="font-normal leading-snug text-muted-foreground">
              These cookies help to improve the performance of the website.
            </span>
          </Label>
          <Switch id="performance" />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
