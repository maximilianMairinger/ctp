import exec, { check } from "./shell"

export default function(options: Options) {
  check("npm")
  
  exec("npm i")
  options.dependencies.ea((dependency) => {
    exec("npm i " + dependency)
  })

  if (options.public) exec("npm publish")
}