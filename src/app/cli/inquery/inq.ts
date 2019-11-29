import * as inquirer from "inquirer"
import * as merge from "merge-options";

type genericObject = {[key: string]: any}


export default async function<T = any>(questions: genericObject[] | genericObject, mergeTo_ignore?: string[])
export default async function<T = any>(questions: ((ignore: string[]) => Promise<T>) | genericObject[] | genericObject, mergeTo_ignore?: genericObject)
export default async function<T = any>(questions: ((ignore: string[]) => Promise<T>) | genericObject[] | genericObject, mergeTo_ignore?: genericObject | string[]) {
  if (typeof questions === "function") {
    if (mergeTo_ignore) {
      return merge(await questions(Object.keys(mergeTo_ignore)), mergeTo_ignore)
    }
    else {
      return await questions([])
    }
  }
  else {
    let wasSingle = !(questions instanceof Array)
    if (wasSingle) questions = [questions]


    if (mergeTo_ignore) {
      let isMerge = !(mergeTo_ignore instanceof Array)
      let ignore = isMerge ? Object.keys(mergeTo_ignore) : mergeTo_ignore
      let rm = []
      questions.ea((e, i) => {
        if (ignore.includes(e.name)) rm.add(i)
      })
      questions.rmI(...rm)
      let inq = await inquirer.prompt(questions)
      return isMerge ? merge(mergeTo_ignore, inq) : inq
    }
    else {
      let ans = await inquirer.prompt(questions)
      if (wasSingle) {
        return ans[Object.keys(ans).first]
      }
      else return ans
    }
  }
}
