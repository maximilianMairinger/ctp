import npmSetup from "../../setupCL/npmSetup"
import SSH from "ssh2-promise"
import { error, info, log, warn } from "../../lib/logger/logger"
import { Octokit } from "@octokit/rest"

export * from "./schema"


export default async function(options: Options) {
  //await npmSetup(options.dependencies)

  let ssh = options.remoteSSHClient
  let octokit = options.octokit
  if (octokit) {
    let { octokit } = options as {octokit: Octokit, destination: string}
    try {
      info("Publishing repo")
    
      await octokit.repos.createForAuthenticatedUser({
        name: options.name,
        description: options.description,
        private: !options.public,
        homepage: `https://${options.publishDomain}`
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


  
  let who = await ssh.exec("whoami")
  log(who)
  

  ssh.close()
}