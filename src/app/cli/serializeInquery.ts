import Serialize from "./serialize/serialize"
import cloneShallow from "shallow-clone"

export default async function(serilationName: string, func: (_default: GenericObject) => (GenericObject | Function)[], implicitlyInclude?: string[]) {
  let ser = new Serialize(serilationName)
  let defaults = await ser.read()
  let ar = await func(defaults)

  let include: string[] = implicitlyInclude !== undefined ? [...implicitlyInclude] : []

  ar.ea((e) => {
    if (!(e instanceof Function)) {
      if (e.default === true) {
        e.default = defaults[e.name]
        include.add(e.name)
      }
    }
  })

  ar.add(async (options: any) => {
    let optionsWithoutSensitiveInformations = cloneShallow(options)


    for (const key in optionsWithoutSensitiveInformations) {
      if (!include.includes(key) || optionsWithoutSensitiveInformations[key] === "") delete optionsWithoutSensitiveInformations[key]
    }

    
    
    await ser.write(optionsWithoutSensitiveInformations)
  })
  return ar
}
