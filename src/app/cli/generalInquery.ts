import { promises as fs } from "fs"
import * as path from "path"
import { camelCaseToDash } from "dash-camelcase"
import npmNameIsValid from "npm-name"
import Octokit from "@octokit/rest"



export default async function(options: Options) {
  let defaults = await readDefaults()


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
    let injectIndex = 8
    return async () => {
      if (options.githubPassword === "") {
        return
      }


      let octokit = new Octokit({
        auth: {
          username: options.githubUsername,
          password: options.githubPassword,
          async on2fa() {
            return req({name: "2fa", message: "Two-factor authentication Code"});
          }
        }
      });

      function ask2fa() {
        return
      }
  
      
      if (true) {
        delete options.githubPassword
        ls.inject(recursiveCheckName, injectIndex)
        injectIndex++
        return {name: "name", message: "Auth faild. Github Password (to neglect github sync press ENTER)"}
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
    {name: "githubPassword", message: "Github Password", type: "password", mask: true},
    {name: "githubPassword", message: "Github Password", type: "password", mask: true},
    {name: "public", message: "Create as public repo", type: "confirm"},
    


    async () => {
      let optionsClone = JSON.parse(JSON.stringify(options))
      delete optionsClone.githubPassword
      await writeDefaults(optionsClone)
    },
  ]

  return ls
}


let defaultsSavePath = path.join(__dirname, "./../../../defaultCommandLineOpions.json")

export async function writeDefaults(defaults: GenericObject) {
  await fs.writeFile(defaultsSavePath, JSON.stringify(defaults, undefined, "  "))
}

async function readDefaults() {
    return JSON.parse((await fs.readFile(defaultsSavePath)).toString())
}