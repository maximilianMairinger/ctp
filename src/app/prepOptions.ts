import { camelCaseToDash, dashToCamelCase } from "dash-camelcase"
import * as path from "path"
import * as cc from "change-case"



export default function init(o: Options): void {
  const index = {
    name: () => dashToCamelCase(o.name),
    nameAsDashCase: () => camelCaseToDash(o.name),
    nameWithSpaces: () => {
      let nameWs = o.nameAsDashCase.split("-").join("_").split("_").join(" ")
      return nameWs.charAt(0).toUpperCase() + nameWs.substr(1)
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
      o.keywords.ea((e, i) => {
        o.keywords[i] = e.toLowerCase()
      })
    },
    dependencyImports: () => {
      let dependencyImports = ""
      o.dependencies.ea((e) => {
        dependencyImports += "import " + cc.camelCase(e) + " from \"" + e + "\"\n"
      })
      return dependencyImports
    },
    public: () => (!o.githubPassword && o.public === undefined) ? false : o.public
  }

  for (let k in o) {
    o[k] = index[k]()
  }

}
