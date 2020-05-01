import exec, { check } from "./shell"

export default async function(dependencies: string[], publish: boolean = false) {
  check("npm")
  
  exec("npm i")
  dependencies.ea((dependency) => {
    exec("npm i " + dependency)
  })

  if (publish) exec("npm publish")
}