import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadCrumb({ current }: any) {
  const path = usePathname();

  const breadcrumbMap: any = {
    "/": ["Home"],
    "/pages/live": ["Home", "Live"],
    "/pages/group": ["Home", "Group"],
    "/docs/components": ["Home", "Components"],
  };

  const renderBreadcrumbItem = (label: string, href: string) => (
    <BreadcrumbItem>
      {label === "Home" ? (
        <Link href="/">{label}</Link>
      ) : (
        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
  );

  return (
    <Breadcrumb className="flex justify-center mt-4">
      <BreadcrumbList>
        {breadcrumbMap[path]?.map((label: string, index: number) => (
          <React.Fragment key={index}>
            {renderBreadcrumbItem(label, path)}
            {index !== breadcrumbMap[path].length - 1 && (
              <BreadcrumbSeparator />
            )}
          </React.Fragment>
        ))}
        {current && <BreadcrumbSeparator />}
        {current && (
          <BreadcrumbItem>
            <BreadcrumbPage>{current}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
