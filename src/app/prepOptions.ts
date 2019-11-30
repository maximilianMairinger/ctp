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

  o.dependencies = beautifyJSON(o.dependencies, "  ", "  ")

  console.log(o.keywords);
  
  o.keywords = beautifyJSON(o.keywords, "  ", "  ")

  console.log(o.keywords);
  

  let dependencyImports = ""
  JSON.parse(options.dependencies).ea((e) => {
    if (e !== "xrray") dependencyImports += "import " + e + " from " + e + "\n"
    else dependencyImports += "require(\"xrray\")(Array)\n"
  })

  f("dependencyImports", dependencyImports)
}


function beautifyJSON(json: string, tabin: string = "  ", globalTabin: string = "") {
  return JSON.stringify(JSON.parse(json), undefined, tabin).split("\n").join("\n" + globalTabin)
}


function f(key: string, to: any) {
  if (!(key in o)) o[key] = to
}