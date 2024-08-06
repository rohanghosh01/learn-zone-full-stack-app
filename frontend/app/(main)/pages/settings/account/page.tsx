"use client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ChangePassword } from "@/components/changePassword";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/lib/nextSlice";
import * as API from "../../../../../services/api";

export default function SettingsAccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state?.user);

  const handleChangePassword = async (data: any) => {
    try {
      let res: any = await API.changePassword(data);
      document.cookie = `token=; path=/;`;
      router.push("/auth/login");
      dispatch(setUser(null));
    } catch (error) {
      console.log("error logout", error);
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      let res: any = await API.updateProfile(data);
      dispatch(setUser(res?.result));
    } catch (error) {
      console.log("error handleProfileUpdate", error);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and
          timezone.
        </p>
      </div>
      <Separator />
      <AccountForm data={user} handleUpdate={handleProfileUpdate} />
      <Separator />
      <ChangePassword handleChangePassword={handleChangePassword} />
    </div>
  );
}
