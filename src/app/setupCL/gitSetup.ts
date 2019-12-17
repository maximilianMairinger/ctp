import exec, { check } from "./shell"
import * as Octokit from "@octokit/rest"
import req from "./../cli/inquery/inq"
import { info, log, warn } from "../lib/logger/logger"


export default async function(options: Options) {
  check('git')
  exec("git init")
  exec("git add -A")
  exec('git commit -m "init"')
  exec("git remote add origin https://github.com/" + options.githubUsername + "/" + options.name + ".git")
  

  if (options.authedOctokit !== undefined) {
    let { authedOctokit: octokit } = options
    try {
      info("Publishing repo")
    
      await octokit.repos.createForAuthenticatedUser({
        name: options.name,
        description: options.description,
        private: !options.public,
        homepage: "https://www.npmjs.com/package/" + options.nameAsDashCase
      })

      try {
        info("Setting topics")

        await octokit.repos.replaceTopics({
          owner: options.githubUsername,
          repo: options.name,
          names: options.keywords
        })
      
        
      }
      catch(e) {
        warn("Failed to set topics because:")
        warn(e)
      }


      exec("git push -u origin master")
    }
    catch(e) {
      warn("Faild to publish repo because:")
      warn(e)
    }
    
    
  }
  else info("Skipping github sync. No valid authentication method available.")
  
}