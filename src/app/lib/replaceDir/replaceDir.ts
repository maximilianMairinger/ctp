import { promises as fs } from "fs"
import replace from "../replace/replace"
import replaceFromFile from "../replaceFromFile/replaceFromFile"
import setupAt from "../at/at"

export default async function replaceDir(at: (path: string) => string, options: Options) {
  await (await fs.readdir(at("/"))).ea(async (fileName) => {
    let newFileName = replace(fileName, options)
    let finalFilePath: string
    if (newFileName !== fileName) {
      finalFilePath = at(newFileName)
      await fs.rename(at(fileName), finalFilePath)
    }
    else finalFilePath = at(fileName);

    
      

    if ((await fs.stat(finalFilePath)).isDirectory()) await replaceDir(setupAt(finalFilePath), options)
    else await replaceFromFile(finalFilePath, options)
  })
}