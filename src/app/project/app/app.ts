import npmSetup from "../../setupCL/npmSetup"

export * from "./schema"


export default async function(options: Options) {
  await npmSetup(options.dependencies)


  


}