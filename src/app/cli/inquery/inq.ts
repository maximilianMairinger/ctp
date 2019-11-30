import * as inquirer from "inquirer"
import * as merge from "merge-options";

type genericObject = {[key: string]: any}


export default async function inq<T = any>(questions: genericObject[] | genericObject, ignore?: string[] | Options)
export default async function inq<T = any>(questions: ((options: Options) => Promise<genericObject> | genericObject | Promise<any[]> | any[]) | genericObject[] | genericObject, options: Options)
export default async function inq<T = any>(questions: ((options: Options) => Promise<genericObject> | genericObject | Promise<any[]> | any[]) | genericObject[] | genericObject, options_ignore?: Options | string[]) {
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
    let rm = []
    questions.ea((e, i) => {
      if (ignore.includes(e.name)) rm.add(i)
    })
    questions.rmI(...rm)
    let inq = await inquirer.prompt(questions)
    let end = isMerge ? merge(options_ignore, inq) : inq

    if (wasSingle) {
      return end[Object.keys(end).first]
    }
    else return end

  }
}
