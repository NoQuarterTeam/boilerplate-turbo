import * as React from "react"
import { BiX } from "react-icons/bi"
import { CgSearch } from "react-icons/cg"
import { useSearchParams } from "@remix-run/react"
import queryString from "query-string"

import { merge } from "~/lib/tailwind"

import { IconButton } from "./IconButton"
import { Input, type InputProps } from "./Inputs"

export function Search({ placeholder, name = "search", ...props }: InputProps) {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = React.useState(params.get(name) || "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!search && !params.get(name)) return
    const existingParams = queryString.parse(params.toString())
    if (!search) {
      delete existingParams[name]
    } else {
      existingParams[name] = search
    }
    if (existingParams.page) delete existingParams.page
    setParams(queryString.stringify(existingParams))
  }
  const clearSearch = () => {
    const existingParams = queryString.parse(params.toString())
    delete existingParams[name]
    setParams(queryString.stringify(existingParams))
    setSearch("")
  }

  const isPendingSearch = !!search || !!params.get(name)

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <div className="center absolute left-2 top-0 h-full">
        <IconButton type="submit" aria-label="search" variant="ghost" icon={<CgSearch />} />
      </div>
      <Input
        name={name}
        placeholder={placeholder || "Search"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        {...props}
        ref={undefined}
        className={merge("px-14", props.className)}
      />
      <div className="center absolute right-2 top-0 h-full">
        {!!isPendingSearch && <IconButton onClick={clearSearch} aria-label="clear search" variant="ghost" icon={<BiX />} />}
      </div>
    </form>
  )
}
