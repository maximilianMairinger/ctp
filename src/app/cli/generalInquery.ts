import { promises as fs } from "fs"
import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"



export default async function(options: Options) {
  let defaults = await readDefaults()
  


  return [
    () => {return {name: "name", message: "Project Name", default: path.basename(options.destination)}},
    {name: "description", message: "Description"},
    () => {return {name: "keywords", message: "Keywords as json Array", default: " " + JSON.stringify(camelCaseToDash(options.name).split(/-|_/)) + " "}},
    {name: "dependencies", message: "Dependencies as json Array", default: " [\"xrray\"] "},
    {name: "author", message: "Author", default: defaults.author},
    {name: "githubUsername", message: "Github Username", default: defaults.githubUsername},
    


    () => {writeDefaults(options)},
  ]
}


let defaultsSavePath = path.join(__dirname, "./../../../defaultCommandLineOpions.json")

export async function writeDefaults(defaults: GenericObject) {
  await fs.writeFile(defaultsSavePath, JSON.stringify(defaults))
}

async function readDefaults() {
    return JSON.parse((await fs.readFile(defaultsSavePath)).toString())
}