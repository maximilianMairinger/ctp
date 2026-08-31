import declareComponent from "../../../../../../lib/declareComponent"
import LeftRightSection from "../leftRightSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class LandingSection extends LeftRightSection {
  protected body: BodyTypes

  constructor() {
    super()


  }

  stl() {
    return super.stl() + require("./landingSection.css").toString()
  }
  pug() {
    return require("./landingSection.pug").default
  }
}

declareComponent("c-landing-section", LandingSection)
