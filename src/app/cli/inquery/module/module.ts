import serializeInquery from "../../serializeInquery";
import { constructInjectRecursively } from "../../lib/lib";
import { warn } from "../../../lib/logger/logger";
import isNpmNameValid from "npm-name"
import { camelCaseToDash } from "dash-camelcase";
import * as path from "path"
import { set as setOption } from "./../../../prepOptions"
import isWindows from "is-windows"



export const pre = (options: any) => {
  let win = isWindows()

  const ls = []
  const injectRecursively = constructInjectRecursively(ls)


  let projectFolderName = path.basename(options.destination)
  let projectFolderNpmName = camelCaseToDash(projectFolderName)

  let projectFolderNameIsValidNpmName = isNpmNameValid(projectFolderNpmName)

  return () => {
    let recursiveCheckNpmName = injectRecursively(async () => {
      if (options.SURE_THAT_NPM_NAME_IS_VALID !== undefined) {
        let sure = options.SURE_THAT_NPM_NAME_IS_VALID
        delete options.SURE_THAT_NPM_NAME_IS_VALID
        if (sure) return
        else return {name: "name", message: "Project name"}
      }

      if (options.name.substring(0, 7) === "ignore/") {
        setOption("name", options.name.substring(7))
        return
      }

      let npmNameisValid: boolean = false
  
      if (win) {
        return {name: "SURE_THAT_NPM_NAME_IS_VALID", message: "Unable to validate name when on windows. Please make (manually) sure that https://www.npmjs.com/package/" + options.nameAsDashCase + " is not found! Sure?", type: "confirm"}
      }
      else {
        if (options.nameAsDashCase === projectFolderNpmName) npmNameisValid = await projectFolderNameIsValidNpmName
        else {
          try {
            npmNameisValid = await isNpmNameValid(options.nameAsDashCase)
          }
          catch(e) {
            warn("Unable to check if npm package is taken")
          }
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
      () => {return {name: "web", message: "Is " + options.name + " web based (Y) or server side (n)", type: "confirm"}}
    )

    return ls
  }
}

export const post = [
  {name: "npmOtp", message: "Npm OTP (leave empty to skip)"},
]


// export default [
//   // github name & main files name, default is foldername

//   // handle when folder is not found
//   {name: "name", message: "Project name"},
//   {name: "npmName", message: "Npm name"},
// ]