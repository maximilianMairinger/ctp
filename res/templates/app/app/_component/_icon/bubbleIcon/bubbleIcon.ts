import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class BubbleIcon extends Icon {
  pug() {
    return require("./bubbleIcon.pug").default
  }
  stl() {
    return super.stl() + require("./bubbleIcon.css").toString()
  }
}

declareComponent("c-bubble-icon", BubbleIcon)
