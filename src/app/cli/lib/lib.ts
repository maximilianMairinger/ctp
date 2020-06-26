import * as prepOptions from "./../../prepOptions"
import { set } from "./../../prepOptions";


let options: any;

export function setOptions(_options: any) {
  options = _options
  prepOptions.setOptions(_options)
}


export function constructInjectRecursively(ls: unknown[]) {
  return function injectRecursively<T>(func: T): T {
    let f = async (...a) => {
      //@ts-ignore
      let end = await func(...a)
      if (end) {
        ls.inject(f, ls.lastIndexOf(f) + 1)
      }
  
      return end
    }
    //@ts-ignore
    return f
  }
}

type InjectRecursivelyFunc = ReturnType<typeof constructInjectRecursively>


export function constructRecursiveCheckList(ls: unknown[] | InjectRecursivelyFunc) {
  const injectRecursively = (ls instanceof Function ? ls : constructInjectRecursively(ls)) as InjectRecursivelyFunc

  return function recursiveCheckList(name: string, typeCheck: "number" | "string" | "boolean" = "string", additionalCheck?: (parsed: any) => boolean) {
    const rawName = name + "String"
    return injectRecursively(() => {
      
      let parsed: GenericObject
      try {
        let got: string = options[rawName]
        if (got === "") parsed = []
        else {
          if (got.includes(",")) parsed = got.split(" ").join("").split(",")
          else parsed = got.split(" ")
        }
  
        
        parsed.ea((e) => {
          if (typeof e !== typeCheck) throw new Error("Not all entries are of type " + typeCheck)
        })
  
        if (typeCheck === "string") {
          parsed.ea((e) => {
            if (e === "") throw new Error("Empty fields are not allowed")
          })
        }
        
        if (additionalCheck !== undefined) {
          let checkRes = additionalCheck(parsed)
          if (checkRes) throw new Error()
  
        }
      }
      catch(e) {
        if (!e.message) return {rawName, message: "Invalid list"}
        else return {rawName, message: "Invalid list: " + e.message}
      }
  
      set(name, parsed)
    })
  }
  
}
