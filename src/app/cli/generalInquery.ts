import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"
import { Octokit } from "@octokit/rest"
import inq from "./inquery/inq"
import { error, warn } from "./../lib/logger/logger"
import { camelCase } from "change-case"
import serializeInquery from "./serializeInquery"
import { constructInjectRecursively, constructRecursiveCheckList } from "./lib/lib"

export default async function(options: Options) {
  const ls = []



  const injectRecursively = constructInjectRecursively(ls)
  const recursiveCheckList = constructRecursiveCheckList(injectRecursively)
  


  return serializeInquery("generalInquery", (defaults) => {


    let recursiveGithubAuthCheck = injectRecursively(async () => {
      if (options.authFaild) {
        return {name: "githubPassword", message: "Optional: Sorry. Github Password", type: "password", mask: true}
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
        if (defaults.githubPersonalAccessToken && defaults.githubPersonalAccessToken[options.githubUsername]) {}
        else {
          return {name: "githubPersonalAccessTokenTemp", message: "Optional: Github personal access token"}
        }
      },
      () => options.githubPersonalAccessTokenTemp ? {name: "savePersonalAccessToken", message: "Save personal access token", type: "confirm"} : undefined,
      () => {
        if (options.savePersonalAccessToken) {
          if (!options.githubPersonalAccessToken) {
            options.githubPersonalAccessToken = {}
          }
          options.githubPersonalAccessToken[options.githubUsername] = options.githubPersonalAccessTokenTemp
        }
      },
      {name: "githubPassword", message: "Optional: Github Password", type: "password", mask: true},
      recursiveGithubAuthCheck,
      () => {if (options.public) return {name: "public", message: "Create as public repo", type: "confirm"}}
    )
    return ls
  }, ["githubUsername", "githubPersonalAccessToken"])

  
}