

const keysIdentifier: {start: string, end: string}[] = [
  {start: "${", end: "}"},
  
]


export default function(source: string, replace: GenericObject) {
  for (let key in replace) {
    
    let replaceWith = replace[key]

    for (let id of keysIdentifier) {
      //replace globally
      source = source.split(id.start + key + id.end).join(replaceWith);
    }
  }
  return source
}