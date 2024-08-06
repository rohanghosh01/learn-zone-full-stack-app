"use client";

import { ForgotPasswordForm } from "@/components/forms/forgotPassword-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import * as API from "../../../../services/api";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      let res: any = await API.forgotPassword(data);

      localStorage.setItem("forgot_token", JSON.stringify(res.accessToken));
      router.push("/auth/verification");
    } catch (error: any) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return <ForgotPasswordForm onSubmit={onSubmit} loading={loading} />;
}
