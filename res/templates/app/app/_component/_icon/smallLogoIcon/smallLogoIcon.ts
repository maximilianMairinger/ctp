import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class SmallLogoIcon extends Icon {
  pug() {
    return require("./smallLogoIcon.pug").default
  }
  stl() {
    return super.stl() + require("./smallLogoIcon.css").toString()
  }
}

declareComponent("c-small-logo-icon", SmallLogoIcon)
