import { UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import config from "../config/config.json";
const defaultImage = config.DEFAULT_PROFILE;

const users = [
  {
    name: "John Doe",
    description: "Software Engineer at TechCorp",
    image: defaultImage,
  },
  {
    name: "Jane Smith",
    description: "Product Manager at InnovateX",
    image: defaultImage,
  },
  {
    name: "Sam Wilson",
    description: "Designer at Creatives Inc.",
    image: defaultImage,
  },
];

type CardProps = React.ComponentProps<typeof Card>;

export function UserSuggestionCard({ className, ...props }: CardProps) {
  return (
    <Card className={cn("max-w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Suggestions</CardTitle>
        <CardDescription>People you may know</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 rounded-md border p-4"
          >
            <Image
              src={user.image}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.description}
              </p>
            </div>
            <Button className="text-xs text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
