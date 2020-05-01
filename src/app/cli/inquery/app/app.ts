import serializeInquery from "../../serializeInquery";
import { constructInjectRecursively } from "../../lib/lib";
import { warn } from "../../../lib/logger/logger";
import isNpmNameValid from "npm-name"
import { camelCaseToDash } from "dash-camelcase";
import * as path from "path"



export const pre = (options) => {
  let projectFolderName = path.basename(options.destination)
  
  return serializeInquery("app", (defaults) => 
    [
      {name: "name", message: "Project Name (camelCase)", default: projectFolderName},
      {name: "remote", message: "Remote server ip", default: defaults.remote},
      {name: "remoteUser", message: "Remote username", default: defaults.remoteUser},
      {name: "remoteSSHKeyPath", message: "Remote ssh key path", default: defaults.remoteSSHKeyPath},
      {name: "isRemoteSSHKeyEncrypted", message: "Is it encrypted via passphrase?", type: "confirm", default: defaults.isRemoteSSHKeyEncrypted},
      () => options.isRemoteSSHKeyEncrypted ? {name: "remoteSSHKeyPassphrase", message: "Passphrase for remote ssh key"} : undefined
    ]
  , ["remoteSSHKeyPassphrase"])
}

export const post = [
  
]


// export default [
//   // github name & main files name, default is foldername

//   // handle when folder is not found
//   {name: "name", message: "Project name"},
//   {name: "npmName", message: "Npm name"},
// ]