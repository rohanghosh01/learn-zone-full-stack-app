import { LoaderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
interface LoadingButtonProps {
  type?: any | "default";
  className?: string;
}

export function LoadingButton({ type, className }: LoadingButtonProps) {
  return (
    <Button disabled variant={type} className={className}>
      <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  );
}
