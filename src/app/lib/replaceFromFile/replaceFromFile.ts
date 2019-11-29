import rpl from "./../replace/replace"
import { promises as fs } from "fs"

export default async function(at: string, replace: GenericObject) {
  let s = (await fs.readFile(at)).toString();
  s = rpl(s, replace)
  await fs.writeFile(at, s);
}