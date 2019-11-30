import * as inquirer from "inquirer"
import * as merge from "mixin-deep";

type basicQuestion = GenericObject[] | GenericObject

type Questions = basicQuestion | ((options: Options) => basicQuestion | Promise<basicQuestion>) | ((options: Options) => basicQuestion | Promise<basicQuestion>)[]


export default async function inq<T = any>(questions: Questions, ignore?: string[] | GenericObject)
export default async function inq<T = any>(questions: ((options: Options) => Questions | Promise<Questions>), options: GenericObject)
export default async function inq<T = any>(questions: Questions | ((options: Options) => Questions | Promise<Questions>), options_ignore: GenericObject | string[] = {}) {
  if (typeof questions === "function") {
    //@ts-ignore
    let ans = await questions(options_ignore)
    if (ans instanceof Array) return await inq(ans, options_ignore)
    else return ans
  }
  else {
    let wasSingle = !(questions instanceof Array)
    if (wasSingle) questions = [questions]

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

    await questions.ea(async (e, i) => {
      if (typeof e === "function") {

        let questions = await e(options)
        if (questions === undefined) return;
        
        let wasSingle = !(questions instanceof Array)
        if (wasSingle) questions = [questions]

        let rm = []
        //@ts-ignore
        questions.ea((e, i) => {
          if (ignore.includes(e.name)) rm.add(i)
        })
        questions.rmI(...rm)
        let inq = await inquirer.prompt(questions)
        merge(options, inq)

        
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
