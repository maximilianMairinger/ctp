import npmSetup from "../../setupCL/npmSetup"
import { NodeSSH as SSH } from "node-ssh"
import { error, info, log, warn } from "../../lib/logger/logger"
import { Octokit } from "@octokit/rest"
import shell, { setDestination as setShellDestination } from "./../../setupCL/shell"
import path from "path"
import gitSetup from "../../setupCL/gitSetup"
import * as global from "./../../global"
import naclUtil from "tweetnacl-util"
import sodium from "tweetsodium"

export * from "./schema"


export default async function(options: Options) {

  
  let octokit = options.octokit as Octokit
  let ssh = options.remoteSSHClient as SSH

  let isOkToPublish = false

  if (octokit) {

    try {
      info("Publishing repo")
    
      await octokit.repos.createForAuthenticatedUser({
        name: options.name,
        description: options.description,
        private: !options.public,
        homepage: `https://${options.publishDomain.toLowerCase()}`
      })

      isOkToPublish = true

      try {
        info("Setting topics")

        await octokit.repos.replaceAllTopics({
          owner: options.githubUsername,
          repo: options.name,
          names: options.keywords
        })
      
        
      }
      catch(e) {
        warn("Failed to set topics. Maybe you've used unsupported characters. Continuing anyway :D")
      }


      
    }
    catch(e) {
      
      try {
        let res = await octokit.repos.listCommits({
          owner: options.githubUsername,
          repo: options.name,
        });

        
        if (res.data.empty) isOkToPublish = true
        else warn("Unable to publish repo. Remote already exists and is a non empty repositotry.")
      }
      catch(e) {
        if (e.message === "Git Repository is empty.") {
          isOkToPublish = true
        }
        else {
          warn("Faild to publish repo")
          warn(e.message)
        }
      }


      
    }
    
    
  }
  else info("Skipping github sync. No valid authentication method available.")

  

  if (isOkToPublish) {

    let req = await octokit.actions.getRepoPublicKey({
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
      return octokit.actions.createOrUpdateRepoSecret({
        owner: options.githubUsername,
        repo: options.name,
        secret_name: name,
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
  else if (ssh) ssh.dispose()



  await gitSetup(options, isOkToPublish)


  if (isOkToPublish) {
    // create dev branch and set it as default

    let masterRef = (await octokit.git.getRef({
      owner: options.githubUsername,
      repo: options.name,
      ref: "heads/master"
    })).data.object

    await octokit.git.createRef({
      owner: options.githubUsername,
      repo: options.name,
      ref: `refs/heads/dev`,
      sha: masterRef.sha
    })


    await octokit.repos.update({
      owner: options.githubUsername,
      repo: options.name,
      default_branch: "dev"
    })

    shell("git pull")
    shell("git checkout dev")



    if (ssh) {


      info("ssh")
      
      try {
        await ssh.exec(`cd ~/nginxCdSetup && source ~/.nvm/nvm.sh && nvm use 14.0.0 && node start --name ${options.name} --domain ${options.publishDomain.toLowerCase()} --githubUsername ${options.githubUsername}`, [], {
          onStdout(chunk) {
            let str = chunk.toString('utf8')
            if (str.endsWith("\n")) str.substr(0, str.length - 1)
            info("ssh: ", str)
          }
        })
      }
      catch(e) {
        warn("Error from ssh")
        warn(e.toString())
      }

      ssh.dispose()
    }
    else info("Skipping remote CD setup. No valid authentication method available.")

    
  }
    


  
  

  await npmSetup(options.dependencies)
}



