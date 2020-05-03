import npmSetup from "../../setupCL/npmSetup"
import SSH from "ssh2-promise"
import { error, info, log, warn } from "../../lib/logger/logger"
import { Octokit } from "@octokit/rest"
import { setDestination as setShellDestination } from "./../../setupCL/shell"
import path from "path"
import gitSetup from "../../setupCL/gitSetup"

export * from "./schema"


export default async function(options: Options) {

  let ssh = options.remoteSSHClient
  let octokit = options.octokit

  let publish = false

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

      publish = true

      try {
        info("Setting topics")

        await octokit.repos.replaceAllTopics({
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


  info("Executing in shell:")
  await gitSetup(options, publish)


  //await npmSetup(options.dependencies)

  
  let who = await ssh.exec("whoami")
  log(who)
  

  ssh.close()
}