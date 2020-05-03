import npmSetup from "../../setupCL/npmSetup"
import * as global from "./../../global"
import { Octokit } from "@octokit/rest"
import { info } from "../../lib/logger/logger"
import { warn } from "console"
export * from "./schema"


export default async function(options: Options) {
  await npmSetup(options.dependencies, options.public)

  if (options.octokit !== undefined) {
    let { octokit } = options as {octokit: Octokit, destination: string}
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
        warn("Failed to set topics")
      }


      
    }
    catch(e) {
      warn("Faild to publish repo")
      warn(e.message)
    }
    
    
  }
  else info("Skipping github sync. No valid authentication method available.")
}


