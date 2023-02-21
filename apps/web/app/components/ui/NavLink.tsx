import { NavLink as RNavLink, type NavLinkProps } from "@remix-run/react"

import { merge } from "~/lib/tailwind"

export function NavLink(props: NavLinkProps) {
  return (
    <RNavLink
      {...props}
      className={(linkProps) =>
        merge(
          "font-body hover:opacity-70",
          linkProps.isActive ? "text-primary-500" : "",
          props.className ? (typeof props.className === "string" ? props.className : props.className(linkProps)) : "",
        )
      }
    >
      {props.children}
    </RNavLink>
  )
}
