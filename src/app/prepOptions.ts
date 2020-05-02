import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"
import * as path from "path"
import * as cc from "change-case"
import { promises as fs } from "fs"
import { Octokit } from "@octokit/rest"
import inq from "./cli/inquery/inq"
import { error, info, log } from "./lib/logger/logger"
import SSH from "ssh2-promise"
import delay from "delay"


let o: any

export function setOptions(options: any) {
  o = options
}


export const index = {
  async name() {
    let name = dashToCamelCase(o.name)
    await set("nameAsDashCase", camelCaseToDash(o.name), true)
    let nameWs = o.nameAsDashCase.split("-").join("_").split("_").join(" ")
    await set("nameAsHumanized", nameWs.charAt(0).toUpperCase() + nameWs.substr(1))
    await set("nameWithSpaces", nameWs.charAt(0).toUpperCase() + nameWs.substr(1), true)
    
    let nameAsShort = ""
    o.nameWithSpaces.split(" ").ea((e) => {
      nameAsShort += e[0]
    })
    await set("nameAsShort", nameAsShort.toUpperCase(), true)
    return name
  },
  destination: () => path.resolve(o.destination),
  description() {
    let desc: string = o.description
    let lastCharOfDescription = desc.charAt(desc.length-1)
    while (lastCharOfDescription === " ") {
      desc = desc.substring(0, desc.length-1)
      lastCharOfDescription = desc.charAt(desc.length-1)
    }

    return lastCharOfDescription !== "." ? desc + "." : desc
  },
  async keywords() {
    //@ts-ignore
    (o.keywords as string[]).inner("toLowerCase", [])
    o.keywords.ea((e, i) => {
      o.keywords[i] = e.toLowerCase()
    })
    await set("keywordsAsJSON", JSON.stringify(o.keywords, undefined, "  "), true)
  },
  async dependencies() {
    let dependencyImports = ""
    o.dependencies.ea((e) => {
      dependencyImports += "import " + cc.camelCase(e) + " from \"" + e + "\"\n"
    })
    await set("dependencyImports", dependencyImports, true)
  },
  async remoteSSHKeyPath() {
    let pth = path.resolve(o.remoteSSHKeyPath)
    try {
      set("remoteSSHKey", await fs.readFile(pth))
      set("isRemoteSSHKeyPathValid", true, true)
    }
    catch(e) {
      set("isRemoteSSHKeyPathValid", false, true)
    }
    return pth
  },
  async githubPassword() {
    if (o.githubPassword === "") {
      set("public", false)
      await set("githubAuthFaild", false, true)
      return
    }


    let octokit = new Octokit({
      auth: {
        username: o.githubUsername,
        password: o.githubPassword,
        async on2fa() {
          return o.github2Factor || await inq("Two-factor authentication code");
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

    await set("octokit", octokit, true)
    await set("githubAuthFaild", authFaild, true)
  },
  async remote() {
    await set("gotRemote", !!o.remote, true)
  },
  async remoteSSHKeyPassphrase() {
    console.log("uuuuuuuk")



    let ssh = new SSH({
      host: o.remote,
      username: o.remoteUser,
      privateKey : o.remoteSSHKey,
      passphrase: o.remoteSSHKeyPassphrase
    })

    
  
    info("Connect to SSH remote at " + o.remote)
    
    try {
      await ssh.connect()
    }
    catch (e) {
      error("SSH: Unable to connect to " + o.remote + ": ")
      error(await e.message)
      info(e)
      set("isSSHRemoteValid", false, false)
      return
    }
    set("remoteSSHClient", ssh, true)
    set("isSSHRemoteValid", true, true)
  }
}

  

export async function set(key: string, to: any, force = false) {
  if (force) {
    o[key] = to
    if (index[key] !== undefined) {
      let res = await index[key]()
      if (res !== undefined) o[key] = res
    }
  }
  else if (o[key] === undefined) {
    o[key] = to
    if (index[key] !== undefined) {
      let res = await index[key]()
      if (res !== undefined) o[key] = res
    }
  }
}


export async function prep(options: any) {
  
  for (let k in options) {
    if (options[k] === undefined) continue
    o[k] = options[k]

    let f = index[k]
    if (f !== undefined) {
      let res = await f()
      if (res !== undefined) o[k] = res
    }
  }
}


