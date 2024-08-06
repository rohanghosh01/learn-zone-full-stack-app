"use client";

import { RegisterForm } from "@/components/forms/register-form";
import { emailSignup, upload } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

import * as API from "../../../../services/api";
import { toast } from "react-hot-toast";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      data.name = data.firstName + " " + data.lastName;
      if (fileUrl) {
        data.profileImage = fileUrl;
      }

      let res: any = await API.signup(data);
      if (res) {
        await emailSignup(data);
        localStorage.setItem(
          "verification_token",
          JSON.stringify(res.accessToken)
        );

        router.push("/auth/verification");
      }
    } catch (error: any) {
      toast.error(error.message || "Error signup");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (file) {
      setUploading(true);
      console.log(">>>>>>>>>>>>>>>>>>>log", "true");
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
    <RegisterForm
      onSubmit={onSubmit}
      loading={loading}
      handleUpload={handleUpload}
      uploading={uploading}
      fileUrl={fileUrl}
    />
  );
}
