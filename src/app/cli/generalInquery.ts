import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"
import * as Octokit from "@octokit/rest"
import inq from "./inquery/inq"
import { error, warn } from "./../lib/logger/logger"
import { camelCase } from "change-case"
import serializeInquery from "./serializeInquery"
import { constructInjectRecursively, recursiveCheckList } from "./lib/lib"

export default async function(options: Options) {
  const ls = []



  const injectRecursively = constructInjectRecursively(ls)
  
  


  return serializeInquery("generalInqueryDefaults", (defaults) => {
    let recursiveGithubAuthCheck = injectRecursively(() => {
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
          return {name: "githubPassword", message: "Optional: Github auth faild. Github Password", type: "password", mask: true}
        }
        else {
          options.authedOctokit = octokit
        }
    
      }
    })

  
  
  
    let recursiveCheckKeywords = recursiveCheckList("keywords")
    let recursiveCheckDependencies = recursiveCheckList("dependencies")
  
  
    

  
    ls.add(
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
    )
    return ls
  }, ["githubPassword", "authedOctokit"])

  
}