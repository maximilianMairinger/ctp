import { Data } from "josm";
import declareComponent from "../../../lib/declareComponent"
import ThemeAble from "../themeAble"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class NewsBubble extends ThemeAble {
  public body: BodyTypes

  constructor() {
    super()


  }

  content(to: string) {
    this.body.content.txt(to)
  }
  heading(to: string) {
    this.body.heading.txt(to)
  }
  number(to: string) {
    this.body.number.txt(funcifyData(to, formatNumber) as Data<string>)
  }
  link(to: string) {
    this.body.link.link(to)
  }

  stl() {
    return super.stl() + require("./newsBubble.css").toString()
  }
  pug() {
    return require("./newsBubble.pug").default
  }
}

function funcifyData<T, R>(data: Data<T> | T, f: (val: T) => R): Data<R> | R {
  if (data instanceof Data) {
    return data.tunnel(f)
  } else {
    return f(data)
  }
}

// format number: 1 => 01
function formatNumber(num: number | string) {
  return +num < 10 ? `0${num}` : `${num}`
}

declareComponent("c-news-bubble", NewsBubble)
