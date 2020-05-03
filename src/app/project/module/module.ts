import npmSetup from "../../setupCL/npmSetup"
import * as global from "./../../global"
import { Octokit } from "@octokit/rest"
import { info } from "../../lib/logger/logger"
import { warn } from "console"
import gitSetup from "../../setupCL/gitSetup"
export * from "./schema"


export default async function(options: Options) {
  

  let octokit = options.octokit

  let publish = false

  if (octokit !== undefined) {
    
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

        await octokit.repos.replaceAllTopics({
          owner: options.githubUsername,
          repo: options.name,
          names: options.keywords
        })

        publish = true
        
      }
      catch(e) {
        warn("Failed to set topics")
        warn(e.message)
      }


      
    }
    catch(e) {
      warn("Faild to publish repo")
      warn(e.message)
    }
    
    
  }
  else info("Skipping github sync. No valid authentication method available.")



  info("Executing in shell:")
  await gitSetup(options, publish)

  await npmSetup(options.dependencies, options.public)
}


