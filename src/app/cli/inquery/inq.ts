import * as inquirer from "inquirer"
import * as merge from "merge-options";

type genericObject = {[key: string]: any}
                                                                                                                                                // TODO: ignore
export default async function<T = any>(questions: ((ignore: string[]) => Promise<T>) | genericObject[] | genericObject, mergeTo?: genericObject | string[]) {
  if (typeof questions === "function") {
    if (mergeTo) {
      return merge(await questions(Object.keys(mergeTo)), mergeTo)
    }
    else {
      return await questions([])
    }
  }
  else {
    let wasSingle = !(questions instanceof Array)
    if (wasSingle) questions = [questions]


    if (mergeTo) {
      let ignore = Object.keys(mergeTo)
      let rm = []
      questions.ea((e, i) => {
        if (ignore.includes(e.name)) rm.add(i)
      })
      questions.rmI(...rm)
      let inq = await inquirer.prompt(questions)
      return merge(mergeTo, inq)
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