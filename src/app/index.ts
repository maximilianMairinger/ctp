import xrray from "xrray"
xrray(Array)
import main from "./main"
export { wrapErrors } from "./main"

import * as propOptions from "./prepOptions"


export default async function(projectKind: string, options: Options) {
  propOptions.setOptions(options);

  await propOptions.prep(options)
  
  main(projectKind, options)
}
