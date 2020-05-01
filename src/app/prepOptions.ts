import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"
import * as path from "path"
import * as cc from "change-case"



export default function init(o: Options): void {
  const index = {
    name: () => {
      let name = dashToCamelCase(o.name)
      o.nameAsDashCase = camelCaseToDash(o.name)
      let nameWs = o.nameAsDashCase.split("-").join("_").split("_").join(" ")
      o.nameWithSpaces = nameWs.charAt(0).toUpperCase() + nameWs.substr(1)
      o.nameAsHumanized = o.nameWithSpaces
      return name
    },
    destination: () => path.resolve(o.destination),
    description: () => {
      let desc: string = o.description
      let lastCharOfDescription = desc.charAt(desc.length-1)
      while (lastCharOfDescription === " ") {
        desc = desc.substring(0, desc.length-1)
        lastCharOfDescription = desc.charAt(desc.length-1)
      }

      return lastCharOfDescription !== "." ? desc + "." : desc
    },
    keywords: () => {
      //@ts-ignore
      (o.keywords as string[]).inner("toLowerCase", [])
      o.keywords.ea((e, i) => {
        o.keywords[i] = e.toLowerCase()
      })
      o.keywordsAsJSON = JSON.stringify(o.keywords, undefined, "  ")
    },
    dependencies: () => {
      o.dependencyImports = ""
      o.dependencies.ea((e) => {
        o.dependencyImports += "import " + cc.camelCase(e) + " from \"" + e + "\"\n"
      })
    }
  }

  if (!o.githubPassword && o.public === undefined) {
    o.public = false
  }

  for (let k in o) {
    let res = index[k]()
    if (res !== undefined) o[k] = res
  }

}
