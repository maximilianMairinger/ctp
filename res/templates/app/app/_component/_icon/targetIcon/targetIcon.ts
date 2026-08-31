import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class TargetIcon extends Icon {
  pug() {
    return require("./targetIcon.pug").default
  }
  stl() {
    return super.stl() + require("./targetIcon.css").toString()
  }
}

declareComponent("c-target-icon", TargetIcon)
