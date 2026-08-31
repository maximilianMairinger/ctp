import Icon from "../icon";
import declareComponent from "../../../lib/declareComponent";

export default class RechargeIcon extends Icon {
  pug() {
    return require("./rechargeIcon.pug").default
  }
  stl() {
    return super.stl() + require("./rechargeIcon.css").toString()
  }
}

declareComponent("c-recharge-icon", RechargeIcon)
