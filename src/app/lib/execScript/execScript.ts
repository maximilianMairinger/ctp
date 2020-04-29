import { LineColumnFinder } from "licofi"


const scriptIdentifier: {start: string, end: string}[] = [
  {start: "$<exec-code>", end: "$</exec-code>"},
  
]




export default function(source: string, options: GenericObject) {

  let finder = new LineColumnFinder(source)
  let optionsKeys = Object.keys(options)
  let optionsKeysString = optionsKeys.join(",")
  let optionsVals = []
  optionsKeys.ea((k) => {
    optionsVals.add(options[k])
  })


  for (let id of scriptIdentifier) {
    while (true) {
      let openIndex = source.indexOf(id.start)
      let closeIndex = source.indexOf(id.end)
      
      if (openIndex === -1 || closeIndex === -1) {
        if (openIndex === -1 && closeIndex === -1) break
        else {
          if (openIndex === -1) {
            let lc = finder.fromIndex(closeIndex)
            throw "Closing script bracket \"" + id.end + "\" in Line: " + lc.line + ", Column: " + lc.column + " does not have a corresponding opening bracket."
          }
          else {
            let lc = finder.fromIndex(openIndex)
            throw "Opening script bracket \"" + id.start + "\" in Line: " + lc.line + ", Column: " + lc.column + " does not have a corresponding closing bracket."
          }
        }
      }

      

      let code = source.substring(openIndex + id.start.length, closeIndex)

      let res = Function(optionsKeysString, code)(...optionsVals)
    
      source = source.replace(id.start + code + id.end, res)

    }
  }

  return source
}

