import exec, { check } from "./shell"

export default function(options: Options) {
  check("npm")
  JSON.parse(options.dependencies).ea((dependency) => {
    exec("npm i " + dependency)
  })
}