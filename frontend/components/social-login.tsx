"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "./loading-btn";

interface loginPropsType {
  type: "google" | "facebook" | "twitter" | "instagram" | "apple" | "gitHub";
  handleSocialLogin: any;
  loading: boolean;
}

const iconList = [
  {
    name: "google",
    icon: Icons.google,
  },
  {
    name: "gitHub",
    icon: Icons.gitHub,
  },
  {
    name: "facebook",
    icon: Icons.facebook,
  },
];
export const SocialLogin = ({
  type,
  handleSocialLogin,
  loading,
}: loginPropsType) => {
  const Icon: any = iconList.find((i) => i.name === type)?.icon;
  return loading ? (
    <LoadingButton
      type="outline"
      className="w-full dark:hover:bg-slate-500 dark:bg-slate-700 bg-slate-200 hover:bg-slate-300"
    />
  ) : (
    <Button
      variant="outline"
      className="w-full dark:hover:bg-slate-500 dark:bg-slate-700 bg-slate-200 hover:bg-slate-300"
      type="button"
      disabled={loading}
      onClick={() => handleSocialLogin(type)}
    >
      <Icon className="mr-2 h-4 w-4" />

      {type}
    </Button>
  );
};
