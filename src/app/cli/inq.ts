import * as inquirer from "inquirer"
import * as merge from "merge-options";

type genericObject = {[key: string]: any}

export default async function<T = any>(questions: ((ignore: string[]) => Promise<T>) | genericObject[], mergeTo?: genericObject) {
  if (typeof questions === "function") {
    if (mergeTo) {
      return merge(await questions(Object.keys(mergeTo)), mergeTo)
    }
    else {
      return await questions([])
    }
  }
  else {
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
      return await inquirer.prompt(questions)
    }
  }
}