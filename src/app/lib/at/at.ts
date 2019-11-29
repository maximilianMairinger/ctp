import * as path from "path"

export default function setUpFrom(destination: string) {
  return function from(...from) {
    return path.join(destination, ...from)
  }
}