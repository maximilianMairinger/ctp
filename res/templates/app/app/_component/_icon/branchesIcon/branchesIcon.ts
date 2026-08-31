import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class BranchesIcon extends Icon {
  pug() {
    return require("./branchesIcon.pug").default
  }
  stl() {
    return super.stl() + require("./branchesIcon.css").toString()
  }
}

declareComponent("c-branches-icon", BranchesIcon)
