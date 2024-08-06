"use client";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/mobile-footer";
import { setUser } from "@/lib/nextSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as API from "../../services/api";
import Loader from "@/components/loading";
import { getCookie } from "@/lib/cookie";
import { SidebarMenu } from "./pages/home/sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [isUser, setIsUser] = useState(false);

  async function getUser() {
    setLoading(true);
    try {
      let res: any = await API.profile();
      dispatch(setUser(res?.result));
      setIsUser(true);
    } catch (error: any) {
      setIsUser(false);
      // console.log("error get profile", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let token = getCookie("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getUser();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex max-h-screen w-full flex-col bg-background">
      {/* <Header /> */}

      {children}
      {isUser && (
        <div className="flex md:hidden z-50">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}
