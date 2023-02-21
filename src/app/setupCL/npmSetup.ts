import exec, { check } from "./shell"

export default async function(options) {
  check("npm")

  if (options.publish ?? false) exec(`npm publish${options.npmOtp ? ` --otp ${options.npmOtp}` : ""}`)
  
  // exec("npm i")
  // dependencies.ea((dependency) => {
  //   exec("npm i " + dependency)
  // })
}