import * as inquirer from "inquirer"
import * as merge from "mixin-deep";

type basicQuestion = GenericObject[] | GenericObject

type Questions = basicQuestion | ((options: Options) => basicQuestion | Promise<basicQuestion>) | ((options: Options) => basicQuestion | Promise<basicQuestion>)[]


export default async function inq<T = any>(questions: Questions, ignore?: string[] | Options)
export default async function inq<T = any>(questions: ((options: Options) => Questions | Promise<Questions>), options: Options)
export default async function inq<T = any>(questions: Questions | ((options: Options) => Questions | Promise<Questions>), options_ignore?: Options | string[]) {
  if (typeof questions === "function") {
    //@ts-ignore
    let ans = await questions(options_ignore)
    if (ans instanceof Array) return await inq(ans, options_ignore)
    else return ans
  }
  else {
    let wasSingle = !(questions instanceof Array)
    if (wasSingle) questions = [questions]


    if (!options_ignore) {
      options_ignore = []
    }
    let isMerge = !(options_ignore instanceof Array)
    //@ts-ignore
    let ignore: string[] = isMerge ? Object.keys(options_ignore) : options_ignore
    await questions.ea(async (e, i) => {
      if (typeof e === "function") {

        let questions = await e(options_ignore)
        let wasSingle = !(questions instanceof Array)
        if (wasSingle) questions = [questions]

        let rm = []
        //@ts-ignore
        questions.ea((e, i) => {
          if (ignore.includes(e.name)) rm.add(i)
        })
        questions.rmI(...rm)
        let inq = await inquirer.prompt(questions)
        isMerge ? merge(options_ignore, inq) : inq

        
      }
      else if (!ignore.includes(e.name)) {
        let inq = await inquirer.prompt([e])
        isMerge ? merge(options_ignore, inq) : inq
      }
    })

    if (wasSingle) {
      return options_ignore[Object.keys(options_ignore).first]
    }
    else return options_ignore

  }
}
