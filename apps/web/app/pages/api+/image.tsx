import type { LoaderArgs } from "@remix-run/node"
import { Response as NodeResponse } from "@remix-run/node"
import axios from "axios"
import { createHash } from "crypto"
import fs from "fs"
import fsp from "fs/promises"
import path from "path"
import sharp from "sharp"

import { IS_PRODUCTION } from "~/lib/config.server"

const badImageBase64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

function badImageResponse() {
  const buffer = Buffer.from(badImageBase64, "base64")
  return new Response(buffer, {
    status: 500,
    headers: {
      "Cache-Control": "max-age=0",
      "Content-Type": "image/gif;base64",
      "Content-Length": buffer.length.toFixed(0),
    },
  })
}

function getIntOrNull(value: string | null) {
  if (!value) return null
  return Number.parseInt(value)
}

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const url = new URL(request.url)

    const src = url.searchParams.get("src")
    if (!src) return badImageResponse()

    const width = getIntOrNull(url.searchParams.get("width"))
    const height = getIntOrNull(url.searchParams.get("height"))
    const quality = getIntOrNull(url.searchParams.get("quality")) || 90
    const fit: any = url.searchParams.get("fit") || "cover"

    // Create hash of the url for unique cache key
    const hash = createHash("sha256")
      .update("v1")
      .update(request.method)
      .update(request.url)
      .update(width?.toString() || "0")
      .update(height?.toString() || "0")
      .update(quality?.toString() || "80")
      .update(fit)

    const key = hash.digest("hex")
    const cachedFile = path.resolve(path.join(IS_PRODUCTION ? "data/cache/images" : ".data/cache/images", key + ".webp"))

    const exists = await fsp
      .stat(cachedFile)
      .then((s) => s.isFile())
      .catch(() => false)

    // if image key is in cache return it
    if (exists) {
      console.log({ Cache: "HIT", src })
      const fileStream = fs.createReadStream(cachedFile)
      return new NodeResponse(fileStream, {
        status: 200,
        headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
      })
    } else {
      console.log({ Cache: "MISS", src })
    }

    // fetch from original source
    const res = await axios.get(src, { responseType: "stream" })
    if (!res) return badImageResponse()

    // transform image
    const sharpInstance = sharp()
    sharpInstance.on("error", (error: any) => {
      console.error(error)
    })

    if (width || height) sharpInstance.resize(width, height, { fit })
    sharpInstance.webp({ quality })

    // save to cache
    await fsp.mkdir(path.dirname(cachedFile), { recursive: true }).catch(() => {
      // dont need to throw here, just isnt cached in file system
    })
    const cacheFileStream = fs.createWriteStream(cachedFile)
    const imageTransformStream = res.data.pipe(sharpInstance)
    await new Promise<void>((resolve) => {
      imageTransformStream.pipe(cacheFileStream)
      imageTransformStream.on("end", () => {
        resolve()
      })
      imageTransformStream.on("error", async () => {
        // remove file if transform fails
        await fsp.rm(cachedFile).catch(() => {
          // dont need to throw here, just isnt removed from file system
        })
      })
    })

    // return transformed image
    const fileStream = fs.createReadStream(cachedFile)
    return new NodeResponse(fileStream, {
      status: 200,
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    })
  } catch {
    return badImageResponse()
  }
}
