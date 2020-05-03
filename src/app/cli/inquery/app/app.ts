import serializeInquery from "../../serializeInquery";
import { constructInjectRecursively } from "../../lib/lib";
import * as path from "path"



export const pre = (options: any) => {
  const projectFolderName = path.basename(options.destination)

  return [{name: "name", message: "Project name", default: projectFolderName}]
}





export const post = (options: any) => {
  const ls = []

  

  const injectRecursively = constructInjectRecursively(ls)

  const recursivelyCheckSSHKeyPath = injectRecursively(() => {
    if (!options.isRemoteSSHKeyPathValid) {
      return {name: "remoteSSHKeyPath", message: "Sorry, path invalid. Remote ssh key path"}
    }
  })

  const recursivelyCheckPassphrase = injectRecursively(() => {
    if (!options.isSSHRemoteValid) {
      return {name: "remoteSSHKeyPassphrase", message: "Sorry. Passphrase for remote ssh key", type: "password", mask: true}
    }
  })

  const projectFolderName = path.basename(options.destination)
  
  return serializeInquery("appPost", (defaults) => {
    return ls.add(
      {name: "name", message: "Project name", default: projectFolderName},
      
      
      
      {name: "remote", message: "Optional: Remote server ip", default: true},
      () => {
        if (!options.remote) {
          options.remote = defaults.remote
          options.remoteUser = defaults.remoteUser
          options.remoteSSHKeyPath = defaults.remoteSSHKeyPath
          options.baseDomain = defaults.baseDomain
        }
      },
      () => options.gotRemote ? [
        {name: "remoteUser", message: "Remote username", default: defaults.remoteUser},
        {name: "remoteSSHKeyPath", message: "Remote ssh key path", default: defaults.remoteSSHKeyPath},
        recursivelyCheckSSHKeyPath,
        {name: "remoteSSHKeyPassphrase", message: "Optional: Passphrase for remote ssh key", type: "password", mask: true},
        recursivelyCheckPassphrase,
        () => {
          if (defaults.baseDomain !== undefined) {
            return {name: "publishDomain", message: "Publish to domain", default: `${options.name}.${defaults.baseDomain}`}
          }
          else {
            return {name: "publishDomain", message: "Publish to domain (e.g. projectName.example.com)"}
          }
          
        },
      ] : undefined,

    )
  }, ["remoteUser", "remoteSSHKeyPath", "baseDomain"])
}
