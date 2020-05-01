import npmSetup from "../../setupCL/npmSetup"

export * from "./shema"


export default async function(options: Options) {
  await npmSetup(options.dependencies)


  


}