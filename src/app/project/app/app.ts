import npmSetup from "../../setupCL/npmSetup"
import SSH from "ssh2-promise"
import { error, info, log, warn } from "../../lib/logger/logger"
import { Octokit } from "@octokit/rest"
import { setDestination as setShellDestination } from "./../../setupCL/shell"
import path from "path"
import gitSetup from "../../setupCL/gitSetup"
import * as global from "./../../global"
import naclUtil from "tweetnacl-util"
import sodium from "tweetsodium"

export * from "./schema"


export default async function(options: Options) {

  
  let octokit = options.octokit as Octokit

  let publish = false

  if (octokit) {

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
      
      try {
        let res = await octokit.repos.listCommits({
          owner: options.githubUsername,
          repo: options.name,
        });

        
        if (res.data.empty) publish = true
        else warn("Unable to publish repo. Remote already exists and is a non empty repositotry.")
      }
      catch(e) {
        if (e.message === "Git Repository is empty.") {
          publish = true
        }
        else {
          warn("Faild to publish repo")
          warn(e.message)
        }
      }


      
    }
    
    
  }
  else info("Skipping github sync. No valid authentication method available.")

  

  if (publish) {

    let req = await octokit.actions.getPublicKey({
      owner: options.githubUsername,
      repo: options.name
    })
  
    const { key_id, key } = req.data
    const publicKey = naclUtil.decodeBase64(key)
  
    function encrypt(message: string) {
      const encoder = new TextEncoder()
      const messageBytes = encoder.encode(message)
    
      return sodium.seal(messageBytes, publicKey)
    }
  
    function setSecret(name: string, secret: string) {
      return octokit.actions.createOrUpdateSecretForRepo({
        owner: options.githubUsername,
        repo: options.name,
        name: name,
        key_id,
        encrypted_value: naclUtil.encodeBase64(encrypt(secret))
      })
    }
  

    await Promise.all([
      setSecret("HOST", options.remote),
      setSecret("USERNAME", options.remoteUser),
      setSecret("KEY", options.remoteSSHKey),
      setSecret("PASSPHRASE", options.remoteSSHKeyPassphrase)
    ])

  }



  await gitSetup(options, publish)


  let ssh = options.remoteSSHClient
  if (ssh) {
    let who = await ssh.exec("whoami")
    log(who)
    
  
    ssh.close()
  }
  else info("Skipping remote CD setup. No valid authentication method available.")
  //await npmSetup(options.dependencies)

  
  
}



