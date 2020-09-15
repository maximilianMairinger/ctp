import Component from "../component"
import declareComponent from "../../lib/declareComponent"

export default class Site extends Component {

  constructor() {
    super()


  }

  stl() {
    return require("./site.css")
  }
  pug() {
    return require("./site.pug")
  }
}

declareComponent("site", Site)
