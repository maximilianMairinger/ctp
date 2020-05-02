import serializeInquery from "../../serializeInquery";
import { constructInjectRecursively } from "../../lib/lib";
import { warn } from "../../../lib/logger/logger";
import isNpmNameValid from "npm-name"
import { camelCaseToDash } from "dash-camelcase";
import * as path from "path"
import { set as setOption } from "./../../../prepOptions"



export const pre = (options: any) => {
  const ls = []
  const injectRecursively = constructInjectRecursively(ls)


  let projectFolderName = path.basename(options.destination)
  let projectFolderNpmName = camelCaseToDash(projectFolderName)

  let projectFolderNameIsValidNpmName = isNpmNameValid(projectFolderNpmName)

  return () => {
    let recursiveCheckNpmName = injectRecursively(async () => {
      if (options.name.substring(0, 7) === "ignore/") {
        setOption("name", options.name.substring(7))
        return
      }
  
      
      let npmNameisValid: boolean = false
      if (options.nameAsDashCase === projectFolderNpmName) npmNameisValid = await projectFolderNameIsValidNpmName
      else {
        try {
          npmNameisValid = await isNpmNameValid(options.nameAsDashCase)
        }
        catch(e) {
          warn("Unable to check if npm package is taken")
        }
      }
      
      if (!npmNameisValid) {
        delete options.name
        return {name: "name", message: "\"" + options.nameAsDashCase + "\" is already taken. Try another one. (to skip this check write \"ignore/" + options.nameAsDashCase + "\")"}
      }
  
    })


    ls.add(
      {name: "name", message: "Project name", default: projectFolderName},
      recursiveCheckNpmName,
    )

    return ls
  }
}

export const post = [
  
]


// export default [
//   // github name & main files name, default is foldername

//   // handle when folder is not found
//   {name: "name", message: "Project name"},
//   {name: "npmName", message: "Npm name"},
// ]