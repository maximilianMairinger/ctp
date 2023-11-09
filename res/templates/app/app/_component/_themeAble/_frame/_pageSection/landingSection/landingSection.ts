import declareComponent from "../../../../../lib/declareComponent"
import PageSection from "../pageSection"
import { BodyTypes } from "./pugBody.gen"; import "./pugBody.gen"

export default class LandingSection extends PageSection {
  protected body: BodyTypes

  constructor() {
    super("light")

   
  }

  stl() {
    return super.stl() + require("./landingSection.css").toString()
  }
  pug() {
    return require("./landingSection.pug").default
  }
}

declareComponent("landing-section", LandingSection)
