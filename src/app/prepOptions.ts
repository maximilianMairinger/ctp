import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"
import * as path from "path"
import * as cc from "change-case"
import { promises as fs } from "fs"
import { Octokit }  from "@octokit/rest"
import inq from "./cli/inquery/inq"
import { error, info, log } from "./lib/logger/logger"
import { NodeSSH as SSH } from "node-ssh"
import delay from "delay"
import slugify from "slugify"


let o: any

export function setOptions(options: any) {
  o = options
}


export const index = {
  async name() {
    let name = dashToCamelCase(o.name)
    await set("nameAsDashCase", camelCaseToDash(o.name), true)
    let nameWs = o.nameAsDashCase.split("-").join("_").split("_").join(" ")
    await set(["nameWithSpaces", "nameAsHumanized"], nameWs.charAt(0).toUpperCase() + nameWs.substr(1))
    
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

    return lastCharOfDescription !== "." && desc !== "" ? desc + "." : desc
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
      set("remoteSSHKey", (await fs.readFile(pth)).toString())
      set("isRemoteSSHKeyPathValid", true, true)
    }
    catch(e) {
      set("isRemoteSSHKeyPathValid", false, true)
    }
    return pth
  },
  async useStoredGithubPersonalAccessToken() {
    if (typeof o.useStoredGithubPersonalAccessToken === "boolean" && o.useStoredGithubPersonalAccessToken) set("githubPersonalAccessToken", o.githubPersonalAccessTokenTemp)
  },
  async githubPersonalAccessToken() {
    if (o.githubPersonalAccessToken === "") {
      set("public", false)
      o.useStoredGithubPersonalAccessToken = false
      await set("githubAuthFaild", false, true)
      return
    }

    let octokit = new Octokit({
      auth: o.githubPersonalAccessToken
    });

    let authFaild = false
    try {
      // to check authentification
      await octokit.users.getAuthenticated()
    }
    catch(e) {
      authFaild = true
      // error("Error while authenticating.")
      // error(e.message)
    }

    await set("octokit", octokit, true)
    await set("githubAuthFaild", authFaild, true)
  },
  async remote() {
    await set("gotRemote", !!o.remote, true)
  },
  async remoteSSHKeyPassphrase() {

    let ssh = new SSH()
  
    info("Connect to SSH remote at " + o.remote)
    
    try {
      await ssh.connect({
        host: o.remote,
        username: o.remoteUser,
        privateKey : o.remoteSSHKey,
        passphrase: o.remoteSSHKeyPassphrase
      })
    }
    catch (e) {
      // error("SSH: Unable to connect to " + o.remote + ": ")
      // error(await e.message)
      // info(e)
      set("isSSHRemoteValid", false, true)
      ssh.dispose()
      return
    }
    set("remoteSSHClient", ssh, true)
    set("isSSHRemoteValid", true, true)
  },
  publishDomain() {
    let domain = o.publishDomain
    domain = domain.split(".").map(s => slugify(s)).join(".").toLowerCase()
    // just in case slugify changes its behaviour
    domain = domain.split("|").join("or")

    let baseDomain = domain.split(".").rmI(0).join(".")
    set("baseDomain", baseDomain)
    return domain
  },
  web() {
    set("defaultDevScript", o.web ? "devWeb" : "devNode")
  }
}

  

export async function set(keys: string | string[], to: any, force = false, notify: boolean = true) {
  if (!(keys instanceof Array)) keys = [keys]
  if (force) {
    await keys.ea(async (key) => {
      o[key] = to
      if (notify) {
        if (index[key] !== undefined) {
          let res = await index[key]()
          if (res !== undefined) o[key] = res
          return res
        }
      }
    })
  }
  else {
    await keys.ea(async (key) => {
      if (o[key] === undefined) {
        o[key] = to
        if (notify) {
          if (index[key] !== undefined) {
            let res = await index[key]()
            if (res !== undefined) o[key] = res
            return res
          }
        }
      }
    })
    
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


