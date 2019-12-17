import rpl from "../replace/replace"
import script from "../execScript/execScript"
import { promises as fs } from "fs"

export default async function(at: string, options: GenericObject) {
  let s = (await fs.readFile(at)).toString();
  s = rpl(s, options)
  s = script(s, options)
  await fs.writeFile(at, s);
}