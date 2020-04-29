import { promises as fs } from "fs"
import { error } from "../logger/logger"

export default async function fileExisits(path: string) {
  let fileExists: boolean
  try {
    await fs.stat(path)
    fileExists = true
  }
  catch(e) {
    if (e.code !== "ENOENT") error("Unexpected error")
    fileExists = false
  }
  return fileExists
}
