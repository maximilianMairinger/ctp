import Serialize from "./serialize/serialize"
import cloneShallow from "shallow-clone"

export default async function(serializationName: string, func: (_default: GenericObject) => (GenericObject | Function)[], explicitlyInclude?: string[]) {
  let ser = new Serialize(serializationName)
  let defaults = await ser.read()
  let ar = await func(defaults)

  let include: string[] = explicitlyInclude !== undefined ? [...explicitlyInclude] : []

  ar.ea((e) => {
    if (!(e instanceof Function)) {
      if (e.default === true) {
        e.default = defaults[e.name]
        include.add(e.name)
      }
    }
  })

  ar.add(async (options: any) => {
    let optionsWithoutSensitiveInformation = cloneShallow(options)

    for (const key in optionsWithoutSensitiveInformation) {
      if (!include.includes(key) || optionsWithoutSensitiveInformation[key] === "" || optionsWithoutSensitiveInformation[key] === null) delete optionsWithoutSensitiveInformation[key]
      else if (defaults[key] !== undefined && optionsWithoutSensitiveInformation[key] === undefined) optionsWithoutSensitiveInformation[key] = defaults[key]
    }

    
    
    await ser.write(optionsWithoutSensitiveInformation)
  })
  return ar
}
