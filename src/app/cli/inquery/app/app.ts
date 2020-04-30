import serializeInquery from "../../serializeInquery";
import { constructInjectRecursively } from "../../lib/lib";
import { warn } from "../../../lib/logger/logger";
import isNpmNameValid from "npm-name"
import { camelCaseToDash } from "dash-camelcase";
import * as path from "path"



export const pre = (options) => {
  let projectFolderName = path.basename(options.destination)
  
  return [
    () => {return {name: "name", message: "Project Name (camelCase)", default: projectFolderName}},
  ]
}

export const post = [
  
]


// export default [
//   // github name & main files name, default is foldername

//   // handle when folder is not found
//   {name: "name", message: "Project name"},
//   {name: "npmName", message: "Npm name"},
// ]