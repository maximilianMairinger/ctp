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
    // "bin": "./app/dist/cjs/cli/$[name]-cli.js",

    ls.add(
      {name: "name", message: "Project name", default: projectFolderName},
      recursiveCheckNpmName,
      () => {return {name: "cli", message: "Does " + options.name + " have a cli interface", type: "confirm"}},
      () => {return {name: "web", message: "What is the primary runtime (used in dev) of " + options.name + "? " + (options.cli ? "Node (Y) or web (n)" : "Web (Y) or node (n)"), type: "confirm"}},
      () => {if (options.cli) setOption("web", !options.web)},
      () => {
        options.cliBinImport = options.cli ? `\n  "bin": "./app/dist/cjs/cli/${options.name}-cli.js",` : ""
        options.cliUsageReadme = options.cli ? `### CLI\n\n\`\`\`shell\n${options.name} --help\n\`\`\`\n\n### API\n` : ""
      }
      
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