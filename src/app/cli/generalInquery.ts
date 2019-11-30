import { promises as fs } from "fs"
import * as path from "path"



export default function(options: Options) {
  return [
    {name: "name", description: "Project Name", default: path.basename(options.destination)}
  ]
}