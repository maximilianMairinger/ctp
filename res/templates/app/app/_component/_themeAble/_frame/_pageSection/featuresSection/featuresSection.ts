import declareComponent from "../../../../../lib/declareComponent"
import UiButton from "../../../_focusAble/_formUi/_rippleButton/rippleButton";
import PageSection from "../pageSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class FeaturesSection extends PageSection {
  protected body: BodyTypes

  constructor() {
    super()

    for (const btn of this.q("c-ripple-button") as any as UiButton[]) {
      btn.userFeedbackMode.hover.set(false)
    }

  }
  stl() {
    return super.stl() + require("./featuresSection.css").toString()
  }
  pug() {
    return require("./featuresSection.pug").default
  }
}

declareComponent("c-features-section", FeaturesSection)
