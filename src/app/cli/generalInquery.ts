import { promises as fs } from "fs"
import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"
import npmNameIsValid from "npm-name"
import * as Octokit from "@octokit/rest"
import inq from "./inquery/inq"
import { log, error } from "./../lib/logger/logger"
import Serialize from "./serialize/serialize"


const serialize = new Serialize("cliDefaults");


export default async function(options: Options) {
  let defaults = await serialize.read()


  let recursiveCheckName = (() => {
    let injectIndex = 2
    return async () => {
      if (options.name.substring(0,7) === "ignore/") {
        options.name = options.name.substring(7)
        return
      }
  
      
      let npmName = camelCaseToDash(options.name)
      if (!(await npmNameIsValid(npmName))) {
        delete options.name
        ls.inject(recursiveCheckName, injectIndex)
        injectIndex++
        return {name: "name", message: "\"" + npmName + "\" is already taken. Try another one. (to skip this check write \"ignore/" + npmName + "\")"}
      }
  
    }
  })();

  let recursiveGithubAuthCheck = (() => {
    let injectIndex = 9
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
        return {name: "githubPassword", message: "Github auth faild. Github Password", type: "password", mask: true}
      }
      else {
        options.authedOctokit = octokit
      }
  
    }
  })();
  

  

  let ls = [
    () => {return {name: "name", message: "Project Name", default: path.basename(options.destination)}},
    recursiveCheckName,
    {name: "description", message: "Description"},
    () => {return {name: "keywords", message: "Keywords as json Array", default: " " + JSON.stringify(camelCaseToDash(options.name).split(/-|_/)) + " "}},
    {name: "dependencies", message: "Dependencies as json Array", default: " [\"xrray\"] "},
    {name: "author", message: "Author", default: defaults.author},
    {name: "githubUsername", message: "Github Username", default: defaults.githubUsername},
    {name: "githubPassword", message: "Github Password (to neglect github sync press ENTER)", type: "password", mask: true},
    recursiveGithubAuthCheck,
    {name: "public", message: "Create as public repo", type: "confirm"},
    async () => {
      await serialize.write(options)
    }
  ]

  return ls
}