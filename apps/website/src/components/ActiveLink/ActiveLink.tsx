import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React from "react";
import { Link as NextUILink } from "@nextui-org/react";
export const ActiveLink = ({
  children,
  ...props
}: LinkProps & { children: string }) => {
  const { asPath } = useRouter();

  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const isActive = asPath === props.href || asPath === props.as;

  return (
    <Link {...props}>
      <NextUILink
        block
        color={isActive ? "primary" : "text"}
        underline={isActive}
      >
        {children}
      </NextUILink>
    </Link>
  );
};
