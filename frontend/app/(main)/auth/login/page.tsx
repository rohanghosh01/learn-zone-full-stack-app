"use client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";

import { setUser } from "@/lib/nextSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setCookie } from "@/lib/cookie";
import { googleLogin } from "@/services/firebase";
import * as API from "../../../../services/api";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      let res: any = await API.login(data);
      if (res && res.accessToken) {
        setCookie("token", JSON.stringify(res.accessToken));
        let user: any = await API.profile();

        dispatch(setUser(user.result));
        router.push("/");
      }
      if (res && res.verification_token) {
        localStorage.setItem(
          "verification_token",
          JSON.stringify(res.verification_token)
        );
        router.push("/auth/verification");
      }
    } catch (error: any) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (type: any) => {
    try {
      setLoading(true);
      let res;
      if (type === "google") {
        res = await googleLogin();
      }
      if (res && res.token) {
        let login: any = await API.googleLogin({
          token: res.token,
        });

        setCookie("token", JSON.stringify(login.accessToken));
        let user: any = await API.profile();
        dispatch(setUser(user.result));
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      return;
    }
  };

  return (
    <LoginForm
      onSubmit={onSubmit}
      loading={loading}
      handleSocialLogin={handleSocialLogin}
    />
  );
}
