import Icon from "../highlightAbleIcon";
import declareComponent from "../../../../../lib/declareComponent";

export default class FileTxtIcon extends Icon {
  public highlight() {
    return this.addClass("myHighlight")
    
  }
  public downlight() {
    return this.removeClass("myHighlight")
  }

  pug() {
    return require("./fileTxtIcon.pug").default
  }
  stl() {
    return super.stl() + require("./fileTxtIcon.css").toString()
  }
}

declareComponent("c-file-txt-icon", FileTxtIcon)
