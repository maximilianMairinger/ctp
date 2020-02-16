import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"
import * as path from "path"
import * as cc from "change-case"

let o: Options;

export default function(options: Options) {
  o = options
  
  f("name", dashToCamelCase(options.name))

  let cam = camelCaseToDash(options.name)
  f("nameAsDashCase", cam)

  let nameWs = cam.split("-").join("_").split("_").join(" ")
  nameWs = nameWs.charAt(0).toUpperCase() + nameWs.substr(1)
  f("nameWithSpaces", nameWs)


  options.destination = path.resolve(options.destination)

  let lastCharOfDescription = options.description.charAt(options.destination.length-1)
  if (lastCharOfDescription !== "." && lastCharOfDescription !== " ") options.description += "." 

  options.keywords.ea((e, i) => {
    options.keywords[i] = e.toLowerCase()
  })
  
  

  let dependencyImports = ""
  options.dependencies.ea((e) => {
    dependencyImports += "import " + cc.camelCase(e) + " from " + e + "\n"
  })

  f("dependencyImports", dependencyImports)


  if (!options.githubPassword) options.public = false
}


function f(key: string, to: any) {
  if (!(key in o)) o[key] = to
}