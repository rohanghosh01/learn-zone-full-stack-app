"use client";
import { ResetPasswordForm } from "@/components/forms/resetPassword-form";
import { setCookie } from "@/lib/cookie";
import { setUser } from "@/lib/nextSlice";
import { emailSignup } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

import * as API from "../../../../services/api";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = async (data: any) => {
    let token = localStorage.getItem("reset_token");
    setLoading(true);
    try {
      let res: any = await API.resetPassword(data, token);
      setCookie("token", JSON.stringify(res.accessToken));
      let user: any = await API.profile();

      dispatch(setUser(user.result));
      localStorage.removeItem("forgot_token");
      localStorage.removeItem("reset_token");
      router.push("/");
    } catch (error: any) {
      console.log("error on ResetPassword", error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return <ResetPasswordForm onSubmit={onSubmit} loading={loading} />;
}
