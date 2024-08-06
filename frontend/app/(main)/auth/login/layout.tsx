import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Learn zone | Login",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="w-full lg:grid h-screen lg:grid-cols-2">
        <div className="hidden bg-muted-foreground lg:block">
          <Image
            src="/assets/login.jpg"
            alt="Image"
            width="1920"
            height="1080"
            className="max-h-screen w-full object-cover "
          />
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
