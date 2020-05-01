import npmSetup from "../../setupCL/npmSetup"
import SSH from "ssh2-promise"

export * from "./schema"


export default async function(options: Options) {
  //await npmSetup(options.dependencies)

  let ssh = new SSH({
    host: options.remote,
    username: options.remoteUser,
    idententy: options.remoteSSHKeyPath,
    passphrase: options.remoteSSHKeyPassphrase
  })
  

  await ssh.connect()
  let who = ssh.exec("whoami")
  console.log(who)
  


}