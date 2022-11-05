import Component from "../component"
import declareComponent from "../../lib/declareComponent"

export default class Site extends Component {

  constructor() {
    super()


  }

  stl() {
    return super.stl() + require("./site.css").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

declareComponent("site", Site)
