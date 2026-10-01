"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Vinext's RSC cache uses Web Crypto. Plain HTTP previews use native navigation. */
export default function SiteLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} prefetch={false} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank") return;
    if (!window.crypto?.subtle && typeof props.href === "string") {
      event.preventDefault();
      window.location.assign(props.href);
    }
  }} />;
}
