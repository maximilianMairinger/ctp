import interpolate from "../interpolate/interpolate"
import { promises as fs } from "fs"

export default async function(at: string, options: GenericObject) {
  let s = (await fs.readFile(at)).toString();
  s = interpolate(s, options)
  await fs.writeFile(at, s);
}