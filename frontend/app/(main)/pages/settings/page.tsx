"use client";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import React, { useEffect, useState } from "react";
import * as API from "../../../../services/api";
import { setUser } from "@/lib/nextSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loading";
import { useRouter } from "next/navigation";
import { upload } from "@/services/firebase";

export default function SettingsProfilePage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: any) => state?.user);
  const [userInfo, setUserInfo] = useState<any | null>(user);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function getUser() {
    setLoading(true);
    try {
      let res: any = await API.profile();
      dispatch(setUser(res?.result));
    } catch (error: any) {
      console.log("error get profile", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setUserInfo(user);
    getUser();
  }, []);

  const refreshUser = () => {
    getUser();
  };

  const handleUpload = async (file: File) => {
    if (file) {
      setUploading(true);
      try {
        let res: any = await upload(file);
        console.log(">>>file", res);
        setFileUrl(res);
      } catch (error) {
        console.log("error uploading file", error);
      } finally {
        setUploading(false);
      }
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm
        data={userInfo}
        handleUpload={handleUpload}
        fileUrl={fileUrl}
        uploading={uploading}
        refreshUser={refreshUser}
      />
    </div>
  );
}
