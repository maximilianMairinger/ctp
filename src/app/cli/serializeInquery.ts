import Serialize from "./serialize/serialize"

export default async function(serilationName: string, func: (_default: GenericObject) => (GenericObject | Function)[], ignore?: string[], include?: string[]) {
  let ser = new Serialize(serilationName)
  let ar = await func(await ser.read())

  ar.last = async (options) => {
    let optionsWithoutSensitiveInformations = JSON.parse(JSON.stringify(options))


    if (ignore !== undefined) {
      ignore.ea((s) => {
        delete optionsWithoutSensitiveInformations[s]
      })
    }
    if (include !== undefined) {
      for (const key in optionsWithoutSensitiveInformations) {
        if (!include.includes(key)) delete optionsWithoutSensitiveInformations[key]
      }
    }

    
    
    await ser.write(optionsWithoutSensitiveInformations)
  }
  return ar
}
