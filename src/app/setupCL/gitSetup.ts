import exec, { check } from "./shell"
import * as Octokit from "@octokit/rest"
import req from "./../cli/inquery/inq"
import { info, log } from "../lib/logger/logger"


export default async function(options: Options) {
  check('git')
  exec("git init")
  exec("git add -A")
  exec('git commit -m "init"')
  exec("git remote add origin https://github.com/" + options.githubUsername + "/" + options.name + ".git")
  


  if (options.githubPassword !== "") {


    let octokit = new Octokit({
      auth: {
        username: options.githubUsername,
        password: options.githubPassword,
        async on2fa() {
          return req({name: "2fa", message: "Two-factor authentication Code"});
        }
      }
    });
  
  
    info("Publishing Repo...")
  
    await octokit.repos.createForAuthenticatedUser({
      name: options.name,
      description: options.description,
      private: !options.public,
      homepage: "https://www.npmjs.com/package/" + options.nameAsDashCase
    })
  
    await octokit.repos.replaceTopics({
      owner: options.githubUsername,
      repo: options.name,
      names: options.keywords
    })
  
  
    exec("git push -u origin master")
  }

  
}