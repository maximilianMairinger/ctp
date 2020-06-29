import Component from "../component"

export default class Site extends Component {

  constructor() {
    super()


  }

  stl() {
    return require("./site.css").toString()
  }
  pug() {
    return require("./site.pug").default
  }
}

window.customElements.define('c-site', Site);