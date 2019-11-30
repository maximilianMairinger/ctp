import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"

let o: Options;

export default function(options: Options) {
  o = options
  
  f("name", dashToCamelCase(options.name))

  let cam = camelCaseToDash(options.name)
  f("nameAsDashCase", cam)

  let nameWs = cam.replace("-", " ")
  nameWs = nameWs.charAt(0).toUpperCase() + nameWs.substr(1)
  f("nameWithSpaces", nameWs)


}


function f(key: string, to: any) {
  if (!(key in o)) o[key] = to
}