import interpolate from "../interpolate/interpolate"
import { promises as fs } from "fs"
import isBinPath from 'is-binary-path';




export default async function(at: string, options: GenericObject) {
  if (isBinPath(at)) return;
  let s = (await fs.readFile(at)).toString();
  s = interpolate(s, options)
  await fs.writeFile(at, s);
}