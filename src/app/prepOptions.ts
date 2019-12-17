import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"
import * as path from "path"

let o: Options;

export default function(options: Options) {
  o = options
  
  f("name", dashToCamelCase(options.name))

  let cam = camelCaseToDash(options.name)
  f("nameAsDashCase", cam)

  let nameWs = cam.replace("-", " ")
  nameWs = nameWs.charAt(0).toUpperCase() + nameWs.substr(1)
  f("nameWithSpaces", nameWs)


  options.destination = path.resolve(options.destination)
  
  

  let dependencyImports = ""
  console.log(options.dependencies)
  options.dependencies.ea((e) => {
    if (e !== "xrray") dependencyImports += "import " + e + " from " + e + "\n"
    else dependencyImports += "require(\"xrray\")(Array)\n"
  })

  f("dependencyImports", dependencyImports)
}


function f(key: string, to: any) {
  if (!(key in o)) o[key] = to
}