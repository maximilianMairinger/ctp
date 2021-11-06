import exec, { check } from "./shell"

export default async function(publish: boolean = false) {
  check("npm")

  if (publish) exec("npm publish")
  
  // exec("npm i")
  // dependencies.ea((dependency) => {
  //   exec("npm i " + dependency)
  // })
}