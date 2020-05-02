import npmSetup from "../../setupCL/npmSetup"
import SSH from "ssh2-promise"
import { error, info, log } from "../../lib/logger/logger"

export * from "./schema"


export default async function(options: Options) {
  //await npmSetup(options.dependencies)

  let ssh = options.remoteSSHClient

  
  let who = await ssh.exec("whoami")
  log(who)
  


}