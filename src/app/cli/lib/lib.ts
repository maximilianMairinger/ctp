let options: any;

export function setOptions(_options: any) {
  options = _options
}


export function constructInjectRecursively(ls: any[]) {
  return function injectRecursively<T>(func: T): T {
    let f = (...a) => {
      //@ts-ignore
      let end = func(...a)
      if (end) {
        ls.inject(f, ls.lastIndexOf(f) + 1)
      }
  
      return end
    }
    //@ts-ignore
    return f
  }
}


export function recursiveCheckList(name: string, typeCheck: string = "string", additionalCheck?: (parsed: any) => boolean) {
  return this.injectRecursively(() => {
    let parsed: GenericObject
    try {
      let got: string = options[name]
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
      if (!e.message) return {name, message: "Invalid list"}
      else return {name, message: "Invalid list: " + e.message}
    }

    options[name] = parsed
  })
}
