import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"
import { Octokit } from "@octokit/rest"
import inq from "./inquery/inq"
import { error, warn } from "./../lib/logger/logger"
import { camelCase } from "change-case"
import serializeInquery from "./serializeInquery"
import { constructInjectRecursively, constructRecursiveCheckList } from "./lib/lib"
import { set } from "../prepOptions"

export default async function(options: Options) {
  const ls = []



  const injectRecursively = constructInjectRecursively(ls)
  const recursiveCheckList = constructRecursiveCheckList(injectRecursively)
  


  return serializeInquery("generalInquery", (defaults) => {


    let recursiveGithubAuthCheck = injectRecursively(async () => {
      if (options.authFaild) {
        return {name: "githubPersonalAccessToken", message: "Optional: Sorry. Github personal access token", type: "password", mask: true}
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
        
        return {name: "keywordsString", message: "Optional: Keywords", default: def}
      },
      recursiveCheckKeywords,
      {name: "dependenciesString", message: "Optional: Dependencies"},
      recursiveCheckDependencies,
      {name: "author", message: "Author", default: true},
      () => {return {name: "githubUsername", message: "Github Username", default: defaults.githubUsername || camelCase(options.author) || undefined}},
      () => {
        if (!options.githubPersonalAccessToken) {
          if (defaults.githubPersonalAccessTokenStore && defaults.githubPersonalAccessTokenStore[options.githubUsername]) {
            options.githubPersonalAccessTokenTemp = defaults.githubPersonalAccessTokenStore[options.githubUsername]
            return {name: "useStoredGithubPersonalAccessToken", message: "Use stored personal access token for github (Y/n or set new one)", type: "password", mask: true}
          }
          else {
            return {name: "githubPersonalAccessToken", message: "Optional: Github personal access token", type: "password", mask: true}
          }
        }
      },
      () => {
        if (options.githubPersonalAccessToken === undefined) {
          let ac = options.useStoredGithubPersonalAccessToken.toLowerCase()
          if (ac === "yes" || ac === "y" || ac === "") set("useStoredGithubPersonalAccessToken", true, true)
          else if (ac === "no" || ac === "n") set("useStoredGithubPersonalAccessToken", false, true)
          else {
            set("githubPersonalAccessToken", options.useStoredGithubPersonalAccessToken, true)
            set("useStoredGithubPersonalAccessToken", false, true)
          }
        }
      },
      recursiveGithubAuthCheck,
      () => options.useStoredGithubPersonalAccessToken === undefined ? {name: "savePersonalAccessToken", message: "Save personal access token", type: "confirm"} : undefined,
      () => {
        if (options.savePersonalAccessToken || options.useStoredGithubPersonalAccessToken !== undefined) {
          if (!options.githubPersonalAccessTokenStore) {
            options.githubPersonalAccessTokenStore = {}
          }
          options.githubPersonalAccessTokenStore[options.githubUsername] = options.githubPersonalAccessToken || defaults.githubPersonalAccessTokenStore[options.githubUsername]
        }
      },
      () => {if (!!options.githubPersonalAccessToken) return {name: "public", message: "Create as public repo", type: "confirm"}}
    )
    return ls
  }, ["githubUsername", "githubPersonalAccessTokenStore"])

  
}