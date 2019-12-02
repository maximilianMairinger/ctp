import * as inquirer from "inquirer"
import * as merge from "mixin-deep";

type basicQuestion = GenericObject[] | GenericObject

type Questions = basicQuestion | ((options: Options) => basicQuestion | Promise<basicQuestion>) | ((options: Options) => basicQuestion | Promise<basicQuestion>)[]


export default async function inq<T = any>(questions: string)
export default async function inq<T = any>(questions: Questions, ignore?: string[] | GenericObject)
export default async function inq<T = any>(questions: ((options: Options) => Questions | Promise<Questions>), options: GenericObject)
export default async function inq<T = any>(questions: string | Questions | ((options: Options) => Questions | Promise<Questions>), options_ignore: GenericObject | string[] = {}) {
  if (typeof questions === "function") {
    //@ts-ignore
    let ans = await questions(options_ignore)
    if (ans instanceof Array) return await inq(ans, options_ignore)
    else return ans
  }
  else {
    let wasSingle = !(questions instanceof Array)
    if (wasSingle) {
      //@ts-ignore
      if (typeof questions === "string") {
        questions = {message: questions}
      }
      //@ts-ignore
      if (questions.name === undefined) questions.name = "autofilledNameSinceThereIsJustOneQuestion"
      questions = [questions]
    }

    let options: GenericObject
    let ignore: string[]

    if (options_ignore instanceof Array) {
      options = {}
      ignore = options_ignore
    }
    else {
      options = options_ignore
      ignore = Object.keys(options_ignore)
    }
    
    //@ts-ignore
    await questions.ea(async (e, i) => {
      if (typeof e === "function") {

        let questions = await e(options)
        if (questions === undefined) return;
        await inq(questions, options)

        
      }
      else if (!ignore.includes(e.name)) {
        let inq = await inquirer.prompt([e])
        merge(options, inq)
      }
    })

    if (wasSingle) {
      return options[Object.keys(options).first]
    }
    else return options

  }
}
