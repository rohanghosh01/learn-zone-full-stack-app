import { SidebarMenu } from "./home/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full overflow-x-hidden">
      <div className="hidden md:flex w-80 h-screen fixed flex-col border-r bg-muted/40 z-50">
        {/* Sidebar content goes here */}
        <SidebarMenu />
      </div>
      <div className="md:flex-1 md:ml-80">
        {/* Children component content goes here */}
        {children}
      </div>
    </div>
  );
}
