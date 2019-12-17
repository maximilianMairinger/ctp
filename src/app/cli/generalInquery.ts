import { promises as fs } from "fs"
import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"
import isNpmNameValid from "npm-name"
import * as Octokit from "@octokit/rest"
import inq from "./inquery/inq"
import { log, error, warn } from "./../lib/logger/logger"
import { camelCase } from "change-case"
import serializeInquery from "./serializeInquery"

export default async function(options: Options) {
  


  return serializeInquery("generalInqueryDefaults", (defaults) => {
    let recursiveCheckName = (() => {
      let injectIndex = 2
      return async () => {
        if (options.name.substring(0,7) === "ignore/") {
          options.name = options.name.substring(7)
          return
        }
    
        
        let npmName = camelCaseToDash(options.name)
        let npmNameisValid: boolean = false
        if (npmName === projectFolderName) npmNameisValid = await projectFolderNameIsValidNpmName
        else {
          try {
            npmNameisValid = await isNpmNameValid(npmName)
          }
          catch(e) {
            warn("Unable to check if npm package is taken")
          }
        }
        
        if (!npmNameisValid) {
          delete options.name
          ls.inject(recursiveCheckName, injectIndex)
          injectIndex++
          return {name: "name", message: "\"" + npmName + "\" is already taken. Try another one. (to skip this check write \"ignore/" + npmName + "\")"}
        }
    
      }
    })();
  
    let recursiveGithubAuthCheck = (() => {
      let injectIndex = 11
      return async () => {
        if (options.githubPassword === "") {
          return
        }
  
  
        let octokit = new Octokit({
          auth: {
            username: options.githubUsername,
            password: options.githubPassword,
            async on2fa() {
              return await inq("Two-factor authentication Code");
            }
          }
        });
  
        let authFaild = false
        try {
          // to check authentification
          await octokit.users.getAuthenticated()
        }
        catch(e) {
          authFaild = true
          if (e.message !== "Bad credentials") error("Unknown error while authenticating.")
        }
  
        
  
        
        if (authFaild) {
          delete options.githubPassword
          ls.inject(recursiveGithubAuthCheck, injectIndex)
          injectIndex++
          return {name: "githubPassword", message: "Optional: Github auth faild. Github Password", type: "password", mask: true}
        }
        else {
          options.authedOctokit = octokit
        }
    
      }
    })();
  
  
    function injectRecursively<T>(func: T): T {
      let f = (...a) => {
        //@ts-ignore
        let end = func(...a)
        if (end) {
          ls.inject(f, ls.lastIndexOf(f) + 1)
        }
  
        return end
      }
      //@ts-ignore
      return f
    }
    
    
  
    let recursiveCheckList = (name: string, typeCheck: string = "string", additionalCheck?: (parsed: any) => boolean) => {
      return injectRecursively(() => {
        let parsed: GenericObject
        try {
          let got: string = options[name]
          if (got === "") parsed = []
          else parsed = got.replace(" ", "").replace("\n", "").split(",")
  
          
          parsed.ea((e) => {
            if (typeof e !== typeCheck) throw new Error("Not all entries are of type " + typeCheck)
          })
  
          if (typeCheck === "string") {
            parsed.ea((e) => {
              if (e === "") throw new Error("Empty fields are not allowed")
            })
          }
          
          if (additionalCheck !== undefined) {
            let checkRes = additionalCheck(parsed)
            if (checkRes) throw new Error()
  
          }
        }
        catch(e) {
          if (!e.message) return {name, message: "Invalid list"}
          else return {name, message: "Invalid list: " + e.message}
        }
  
        options[name] = parsed
      })
    };
  
  
    let recursiveCheckKeywords = recursiveCheckList("keywords")
    let recursiveCheckDependencies = recursiveCheckList("dependencies")
  
  
    let projectFolderName = camelCaseToDash(path.basename(options.destination))

    let projectFolderNameIsValidNpmName = isNpmNameValid(projectFolderName)

  
    let ls = [
      () => {return {name: "name", message: "Project Name", default: projectFolderName}},
      recursiveCheckName,
      {name: "description", message: "Description"},
      () => {
        let def = ""
        camelCaseToDash(options.name).split(/-|_/).ea((e) => {
          def += e + ", "
        })
        def = def.substr(0, def.length-2)
        
        return {name: "keywords", message: "Optional: Keywords", default: def}
      },
      recursiveCheckKeywords,
      {name: "dependencies", message: "Optional: Dependencies"},
      recursiveCheckDependencies,
      {name: "author", message: "Author", default: defaults.author},
      () => {
        return {name: "githubUsername", message: "Github Username", default: defaults.githubUsername || camelCase(options.author) || undefined}
      },
      {name: "githubPassword", message: "Optional: Github Password", type: "password", mask: true},
      recursiveGithubAuthCheck,
      () => {if (options.githubPassword !== "") return {name: "public", message: "Create as public repo", type: "confirm"}}
    ]
    return ls
  })

  
}