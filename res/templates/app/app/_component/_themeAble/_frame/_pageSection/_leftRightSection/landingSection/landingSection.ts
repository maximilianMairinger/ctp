import declareComponent from "../../../../../../lib/declareComponent"
import LeftRightSection from "../leftRightSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class LandingSection extends LeftRightSection {
  protected body: BodyTypes

  constructor() {
    super(905)
    this.componentBody.addClass("mobileInverse")

    this.body.btn.userFeedbackMode.hover.set(false)
   
  }

  stl() {
    return super.stl() + require("./landingSection.less").toString()
  }
  pug() {
    return require("./landingSection.pug").default
  }
}

declareComponent("landing-section", LandingSection)
