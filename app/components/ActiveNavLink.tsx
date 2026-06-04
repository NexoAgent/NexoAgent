"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ActiveNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export default function ActiveNavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  exact = false,
}: ActiveNavLinkProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : ""}`}
    >
      {children}
    </Link>
  );
}
